
from typing import Any
from github import Github, Auth
from github import GithubException

class IssueEventHandler():
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
                  repo_name = self.event['repository']["full_name"]
                  issue_number = self.event["issue"]["number"]
                  repo = self.g.get_repo(repo_name)
                  issue = repo.get_issue(number=issue_number)

                  issue_content = issue.body
                  analysis_result = self.service_client.analyze_issue(issue_content)
                  issue.create_comment(analysis_result['content'])

                  return {"success": True}
        except GithubException as e:
            print(f"处理 GitHub 请求时出错：{e}")
            return {"success": False, "error": str(e)}
