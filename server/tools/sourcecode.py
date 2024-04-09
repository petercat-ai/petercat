import os
from typing import List, Optional
from github import Github
from github.ContentFile import ContentFile
from langchain.tools import tool


GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')

DEFAULT_REPO_NAME = "ant-design/ant-design"

g = Github(GITHUB_TOKEN)

@tool
def search_code(
      keyword: str,
      repo_name: Optional[str] = DEFAULT_REPO_NAME, 
      max_num: Optional[int] = 5, 
) -> List[ContentFile]:
    """
    Searches for code files on GitHub that contain the given keyword.

    :param keyword: The search keyword (required).
    :param repo_name: The full name of the repository to search in (optional, format "owner/repo").
    :param access_token: GitHub Access Token for authentication and API rate limit (optional).
    :param max_num: The maximum number of results to return (optional, default is 5).
    :return: A list of ContentFile objects representing the matching code files.
    """
    try:
        query = f'repo:{repo_name} {keyword}'
        
        # Perform the search for code files containing the keyword
        code_files = g.search_code(query=query)[:max_num]
        return code_files 
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
  