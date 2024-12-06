from typing import List
from core.dao.BaseDAO import BaseDAO
from core.models.bot import RepoBindBotConfigVO
from core.models.repository import RepositoryConfig
from supabase.client import Client

from petercat_utils.db.client.supabase import get_client


class RepositoryConfigDAO(BaseDAO):
    client: Client

    def __init__(self):
        super().__init__()
        self.client = get_client()

    def create(self, data: RepositoryConfig):
        try:
            repo_config = (
                self.client.from_("github_repo_config")
                .insert(data.model_dump(exclude=["id"]))
                .execute()
            )
            if repo_config:
                return True, {"message": "GithubRepoConfig created successfully"}
            else:
                return False, {"message": "GithubRepoConfig creation failed"}
        except Exception as e:
            print("Error: ", e)
            return False, {"message": "GithubRepoConfig creation failed"}

    def query_by_owners(self, orgs: list[str]):
        response = (
            self.client.table("github_repo_config")
            .select("*")
            .filter("owner_id", "in", f"({','.join(map(str, orgs))})")
            .execute()
        )

        return response.data

    def update_bot_to_repos(
        self,
        repos: List[RepoBindBotConfigVO],
    ) -> bool:
        for repo in repos:
            res = (
                self.client.table("github_repo_config")
                .update({"robot_id": repo.robot_id})
                .match({"repo_id": repo.repo_id})
                .execute()
            )
            if not res:
                raise ValueError("Failed to bind the bot.")

    def get_by_repo_name(self, repo_name: str):
        response = (
            self.client.table("github_repo_config")
            .select("*")
            .eq("repo_name", repo_name)
            .execute()
        )

        if not response.data or not response.data[0]:
            return None
        repo_config = response.data[0]

        return RepositoryConfig(**repo_config)

    def get_by_bot_id(self, bot_id: str):
        response = (
            self.client.table("github_repo_config")
            .select("*")
            .eq("robot_id", bot_id)
            .execute()
        )
        if not response.data or not response.data[0]:
            return None
        repo_configs = [RepositoryConfig(**repo) for repo in response.data]

        return repo_configs

    def delete_by_repo_ids(self, repo_ids: list):
        response = (
            self.client.table("github_repo_config")
            .delete()
            .in_("repo_id", repo_ids)
            .execute()
        )
        return response
