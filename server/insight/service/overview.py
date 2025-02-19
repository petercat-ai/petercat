from typing import Optional
from github import Github

g = Github()


def get_overview(repo_name: Optional[str] = ""):
    if not repo_name:
        return None

    try:
        repo = g.get_repo(repo_name)

        commit_count = repo.get_commits().totalCount

        info = {
            "stars": repo.stargazers_count,
            "forks": repo.forks_count,
            "commits": commit_count,
        }

        return info
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
