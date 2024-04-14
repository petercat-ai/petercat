
from typing import Any, Dict, Union
from typing_extensions import NotRequired, TypedDict
from github import GithubObject, PullRequest, Repository, Organization, Installation, PullRequestComment
from github import Github, Auth

class PullRequestEventHandler():
    event: Any
    auth: Auth.AppAuth
    g: Github

    def __init__(self, payload, auth: Auth.AppAuth) -> None:
        self.event = payload
        self.auth = auth
        self.g = Github(auth=auth)

    def execute(self):
        match self.event['action']:
            case 'opened':
                repo = self.g.get_repo(self.event['repository']["full_name"])
                pr = repo.get_pull(self.event["pull_request"]["number"])
                comment = pr.create_issue_comment("This is a comment from PeterCat")

                print(repo, pr, comment)
                return { "success": True }
            case _:
                return { "success": True }