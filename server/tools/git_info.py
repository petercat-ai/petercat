from typing import List, Optional
from github import Github
from github.ContentFile import ContentFile
from langchain.tools import tool
import json

DEFAULT_REPO_NAME = "ant-design/ant-design"

g = Github()


@tool
def search_repo(
    repo_name: Optional[str] = DEFAULT_REPO_NAME,
) -> List[ContentFile]:
    """
    Get basic information of a GitHub repository including star count, fork count, and commit count.

    :param repo_name: Name of the repository in the format 'owner/repo'
    :return: A object with basic repo information.
    """
    try:
        repo = g.get_repo(repo_name)

        # Get the latest commit count
        commit_count = repo.get_commits().totalCount

        info = {
            "type": "card",
            "template_id": "GIT_INSIGHT",
            "card_data": {
                "name": repo.name,
                "full_name": repo.full_name,
                "description": repo.description,
                "language": repo.language,
                "stars": repo.stargazers_count,
                "forks": repo.forks_count,
                "commits": commit_count,
                "url": repo.html_url,
            },
        }

        return json.dumps(info)
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
