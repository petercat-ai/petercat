
from typing import Optional
from github import Github, Auth
import json

from langchain.tools import tool
from agent.tools.helper import need_github_login

def factory(token: Optional[Auth.Token]):
    
    @tool
    def get_file_content(repo_name: str, path: str, ref: str):
        """
        Get content of specified pull requst file
        :param repo_name: The name of the repository, e.g., "ant-design/ant-design"
        :param path: The path of file, e.g., /contents/file1.txt
        :param ref: The name of the commit/branch/tag. Default: the repository’s default branch.
        """
        if token is None:
            return need_github_login()
        
        g = Github(auth=token)
        try:
            repo = g.get_repo(repo_name)
            content = repo.get_contents(path=path, ref=ref)
            print(f"get_content: f{content}")
            return json.dumps([])
        except Exception as e:
            print(f"An error occurred: {e}")
            return json.dumps([])
    
    @tool
    def create_pr_summary(repo_name: str, pull_number: int, summary: str):
        """
        Create a code review of specified pull requst file
        :param repo_name: The name of the repository, e.g., "ant-design/ant-design"
        :param pull_number: The number of pull requst: e.g., 123
        :param summary: markdown content of PR summary 
        """
        if token is None:
            return need_github_login()
        
        g = Github(auth=token)
        repo = g.get_repo(repo_name)
        pull_request = repo.get_pull(pull_number)
        # print(f"create_pr_summary, pull_request={pull_request}, summary={summary}")
        pull_request.create_issue_comment(summary)
        return json.dumps([])
    @tool
    def create_review_comment(repo_name: str, pull_number: int, sha: str, path: str, line: int, comment: str):
        """
        Create a code review of specified pull requst file
        :param repo_name: The name of the repository, e.g., "ant-design/ant-design"
        :param pull_number: The number of pull requst: e.g., 123
        :param sha: The sha of file. e.g., 6dcb09b5b57875f334f61aebed695e2e4193db5e
        :param path: The path of file, e.g., /contents/file1.txt
        :param line: The line number to create comment at. e.g., 19
        :param comment: Content of review comments 
        """
        if token is None:
            return need_github_login()
        
        g = Github(auth=token)
        try:
            repo = g.get_repo(repo_name)
            pull_request = repo.get_pull(pull_number)
            commit = repo.get_commit(sha=sha)
            # print(f"create_review_comment, pull_request={pull_request}, commit={commit}, comment={comment}")
            pull_request.create_review_comment(
                body=comment,
                path=path,
                commit=commit,
                line=line,
            )
            return json.dumps([])
        except Exception as e:
            print(f"An error occurred: {e}")
            return json.dumps([])

    return {
        "get_file_content": get_file_content,
        "create_pr_summary": create_pr_summary,
        "create_review_comment": create_review_comment,
    }