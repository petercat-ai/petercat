import json
import os
from github import Github
from langchain.tools import tool

GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')

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
def get_issues_list(repo_name, state="open"):
        """
        Fetches issues from the configured repository
        
        :param repo_name: The name of the repository, e.g., "octocat/Hello-World"
        :state: The state of the issue, e.g: open, closed, all
        """
        try:
            # Obtain the repository object
            repo = g.get_repo(repo_name)
            
            # Retrieve a list of open issues from the repository
            open_issues = repo.get_issues(state=state)
            
            issues_list = [
                {
                    'issue_name': f'Issue #{issue.number} - {issue.title}',
                    'issue_url': issue.html_url
                }
                for issue in open_issues
            ]
            return json.dumps(issues_list)
        except Exception as e:
            print(f"An error occurred: {e}")
            return json.dumps([])  

@tool
def get_issues_by_number(repo_name, number):
        """
        Match issue by the issue number
        
        :param repo_name: The name of the repository, e.g., "octocat/Hello-World"
        :number: The number of the issue
        """
        try:
            # Obtain the repository object
            repo = g.get_repo(repo_name)
            
            issues = repo.get_issue(number=number)
            print(f"issues: {issues}")
            return issues
        except Exception as e:
            print(f"An error occurred: {e}")
            return json.dumps([])  
