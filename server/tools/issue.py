import json
from typing import Optional
from github import Auth, Github
from langchain.tools import tool

DEFAULT_REPO_NAME = "ant-design/ant-design"


def factory(access_token: str):
    print(f"issue_factory: {access_token}")
    auth = Auth.Token(token=access_token)
    g = Github(auth=auth)

    @tool
    def create_issue(repo_name, title, body):
        """
        Create an issue in the specified GitHub repository.

        :param repo_name: The name of the repository, e.g., "ant-design/ant-design"
        :param title: The title of the issue to be created
        :param body: The content of the issue to be created
        """
        try:
            # Get the repository object
            repo = g.get_repo(repo_name)
            print(f"repo: {repo}")
            
            # Create an issue
            issue = repo.create_issue(title=title, body=body)
            return issue.html_url
        except Exception as e:
            print(f"An error occurred: {e}")
            return None
        
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