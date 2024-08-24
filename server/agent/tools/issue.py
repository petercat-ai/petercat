import json
from typing import Optional
from github import Auth, Github
from langchain.tools import tool

from agent.tools.helper import need_github_login

DEFAULT_REPO_NAME = "ant-design/ant-design"

def factory(access_token: Optional[str]):
    @tool
    def create_issue(repo_name: str, title: str, body: str):
        """
        Create an issue in the specified GitHub repository.If an error occurs during processing,
        If user not login, it will return error mesesage and login url
        Please invite user to login if got error

        :param repo_name: The name of the repository, e.g., "ant-design/ant-design"
        :param title: The title of the issue to be created
        :param body: The content of the issue to be created
        """
        if access_token is None:
            return need_github_login()
        auth = Auth.Token(token=access_token)
        g = Github(auth=auth)
        try:
            # Get the repository object
            repo = g.get_repo(repo_name)
            print(f"repo: {repo}")
            
            # Create an issue
            issue = repo.create_issue(title=title, body=body)
            return json.dumps({
                "url": issue.html_url,
                "title": issue.title,
            })
        except Exception as e:
            print(f"An error occurred: {e}")
            return json.dumps([])  
        
    @tool
    def get_issues(
            repo_name: Optional[str] = DEFAULT_REPO_NAME, 
            max_num: Optional[int] = 5, 
            state: Optional[str] = "all",
            sort: Optional[str] = "created",
            order: Optional[str] = "desc"
        ):
            """
            Fetches issues from the configured repository
            
            :param repo_name: The name of the repository, e.g., "ant-design/ant-design"
            :param max_num: The maximum number of issues to fetch
            :param state: The state of the issue, e.g: open, closed, all
            :param sort: The sorting method, e.g: created, updated, comments
            :param order: The order of the sorting, e.g: asc, desc
            """
            g = Github()
            try:
                # Obtain the repository object
                repo = g.get_repo(repo_name)
                
                # Retrieve a list of issues from the repository
                issues = repo.get_issues(state=state, sort=sort, direction=order)[:max_num]
                
                issues_list = [
                    {
                        "issue_name": f"Issue #{issue.number} - {issue.title}",
                        "issue_url": issue.html_url
                    }
                    for issue in issues
                ]
                return json.dumps(issues_list)
            except Exception as e:
                print(f"An error occurred: {e}")
                return json.dumps([])  

    @tool
    def search_issues(
            keyword: str = None,
            repo_name: Optional[str] = DEFAULT_REPO_NAME, 
            max_num: Optional[int] = 5,
            sort: Optional[str] = "created",
            order:  Optional[str] ="asc",
        ):
            """
            Search issues from repository by keyword
            
            :param repo_name: The name of the repository, e.g., "ant-design/ant-design"
            :param keyword: The keyword to search for in the issues
            :param max_num: The maximum number of issues to fetch
            :param sort: The sorting method, e.g: created, updated, comments
            :param order: The order of the sorting, e.g: asc, desc
            :param state: The state of the issue, e.g: open, closed, all
            """
            g = Github()
            try:
                search_query = f"{keyword} in:title,body,comments repo:{repo_name}"
                # Retrieve a list of open issues from the repository
                issues = g.search_issues(query=search_query, sort=sort, order=order)[:max_num]
                print(f"issues: {issues}")
            
                issues_list = [
                    {
                        "issue_name": f"Issue #{issue.number} - {issue.title}",
                        "issue_url": issue.html_url
                    }
                    for issue in issues
                ]
                return json.dumps(issues_list)
            except Exception as e:
                print(f"An error occurred: {e}")
                return json.dumps([])  

    return {
        "create_issue": create_issue,
        "get_issues": get_issues,
        "search_issues": search_issues,
    }