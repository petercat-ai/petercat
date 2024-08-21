
from typing import Any
from github import Github, Auth
from github import GithubException

class PullRequestEventHandler():
    event: Any
    auth: Auth.AppAuth
    g: Github

    def __init__(self, payload: Any, auth: Auth.AppAuth, installation_id: int) -> None:
        self.event: Any = payload
        self.auth: Auth.AppAuth = auth
        self.g: Github = Github(auth=auth)

    async def execute(self):
        try:
            if self.event['action'] == 'opened':
                repo = self.g.get_repo(self.event['repository']["full_name"])
                pr = repo.get_pull(self.event["pull_request"]["number"])
                comment = pr.create_issue_comment("This is a comment from PeterCat")

                print(repo, pr, comment)
                return { "success": True }
            else:
                return { "success": True }
        except GithubException as e:
            print(f"处理 GitHub 请求时出错：{e}")
            return {"success": False, "error": str(e)}
