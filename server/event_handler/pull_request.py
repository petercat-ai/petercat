
from typing import Any
from github import Github, Auth, Repository, PullRequest
from github import GithubException

class PullRequestEventHandler():
    event: Any
    auth: Auth.AppAuth
    g: Github

    def __init__(self, payload: Any, auth: Auth.AppAuth) -> None:
        self.event: Any = payload
        self.auth: Auth.AppAuth = auth
        self.g: Github = Github(auth=auth)

    def execute(self):
        try:
            match self.event['action']:
                case 'opened':
                    repo = self.g.get_repo(self.event['repository']["full_name"])
                    pr = repo.get_pull(self.event["pull_request"]["number"])


                    title = pr.title
                    description = pr.body

                    target_branch_diff = repo.compare(base=pr.base.sha, head=pr.head.sha)
                    print("pullrequest_opened", title, description, target_branch_diff)

                    comment = pr.create_issue_comment("This is a comment from PeterCat")

                    print(repo, pr, comment)
                    return { "success": True }
                case _:
                    return { "success": True }
        except GithubException as e:
            print(f"处理 GitHub 请求时出错：{e}")
            return {"success": False, "error": str(e)}
