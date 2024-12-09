from typing import Any, List
from github import Github, Auth
from github import GithubException
from core.dao.repositoryConfigDAO import RepositoryConfigDAO
from core.models.repository import RepositoryConfig
import time


class InstallEventHandler:
    event: Any
    auth: Auth.AppAuth
    g: Github

    def __init__(self, payload: Any, auth: Auth.AppAuth, installation_id: int) -> None:
        self.event: Any = payload
        self.auth: Auth.AppAuth = auth
        self.g: Github = Github(auth=auth)

    def delete_config(self):
        repositories = self.event["repositories"]
        repo_ids = [str(repo["id"]) for repo in repositories]
        repository_config = RepositoryConfigDAO()
        repository_config.delete_by_repo_ids(repo_ids)

    def add_config(self):
        repositories = self.event["repositories"]
        owner_id = self.event["installation"]["account"]["id"]
        repository_config_dao = RepositoryConfigDAO()
        repository_configs: List[RepositoryConfig] = []
        for repo in repositories:
            repository_config = RepositoryConfig(
                owner_id=str(owner_id),
                repo_name=repo["full_name"],
                repo_id=str(repo["id"]),
                robot_id="",
                created_at=int(time.time()),
            )
            repository_configs.append(repository_config)
        repository_config_dao.create_batch(repository_configs)

    async def execute(self):
        try:
            action = self.event["action"]
            if action == "deleted":
                self.delete_config()
                return {"success": True}
            if action == "created":
                self.add_config()
                return {"success": True}
        except GithubException as e:
            print(f"处理 GitHub 请求时出错：{e}")
            return {"success": False, "error": str(e)}
