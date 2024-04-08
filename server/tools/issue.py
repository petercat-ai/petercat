import json
import os
from github import Github
from langchain.tools import tool

GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')

DEFAULT_REPOSITORY = "ant-design/ant-design"

g = Github(GITHUB_TOKEN)

@tool
def create_issue(repo_name, title, body):
    """
    Create an issue in the specified GitHub repository.

    :param repo_name: The name of the repository, e.g., "octocat/Hello-World"
    :param title: The title of the issue to be created
    :param body: The content of the issue to be created
    """
    try:
        # Get the repository object
        repo = g.get_repo(repo_name)
        print(f"repo: {repo}")
        
        # Create an issue
        issue = repo.create_issue(title=title, body=body)
        print(f"issue: {issue}")
        return issue.html_url
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    
@tool
def get_issues(
        max_num=5, 
        repo_name=DEFAULT_REPOSITORY,
        state="all",
        sort="created",
        order="desc",
    ):
        """
        Fetches issues from the configured repository
        
        :param max_num: The maximum number of issues to fetch
        :param repo_name: The name of the repository, e.g., "octocat/Hello-World"
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
                    'issue_name': f'Issue #{issue.number} - {issue.title}',
                    'issue_url': issue.html_url
                }
                for issue in issues
            ]
            return json.dumps(issues_list)
        except Exception as e:
            print(f"An error occurred: {e}")
            return json.dumps([])  

def search_issues(
        keyword, 
        repo_name=DEFAULT_REPOSITORY,
        max_num=5,
        sort="created",
        order="desc",
    ):
        """
        Fetches issues from the configured repository
        
        :param keyword: The keyword to search for in the issues
        :param repo_name: The name of the repository, e.g., "octocat/Hello-World"
        :param max_num: The maximum number of issues to fetch
        :param sort: The sorting method, e.g: created, updated, comments
        :param order: The order of the sorting, e.g: asc, desc
        """
        try:
            # Obtain the repository object
            repo = g.get_repo(repo_name)
            
            search_query = f'repo:{repo_name} {keyword} in:title,body,comments'

            # Retrieve a list of open issues from the repository
            issues = repo.search_issues(query=search_query, sort=sort, order=order)[:max_num]
         
            issues_list = [
                {
                    'issue_name': f'Issue #{issue.number} - {issue.title}',
                    'issue_url': issue.html_url
                }
                for issue in issues
            ]
            return json.dumps(issues_list)
        except Exception as e:
            print(f"An error occurred: {e}")
            return json.dumps([])  
