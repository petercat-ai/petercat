"""
This file was originally sourced from the https://github.com/langchain-ai/langchain/blob/master/libs/community/langchain_community/document_loaders/github.py
and it has been modified based on the requirements provided by petercat.
"""

import base64
from typing import Callable, Dict, List, Optional
from github import Github
from langchain_core.documents import Document

class GithubFileLoader:
    repo: str
    github: Github
    """Load GitHub File"""
    file_path: str
    branch: str = "main"
    file_filter: Optional[Callable[[str], bool]]
    commit_id: str = None
    file_sha: str = None
    github_api_url: str = "https://api.github.com"

    def __init__(self, **data: Dict):
        self.repo = data["repo"]
        self.file_path = data["file_path"]
        self.branch = data["branch"]
        self.file_filter = data["file_filter"]
        self.github = Github()
        if "commit_id" in data and data["commit_id"]:
            self.commit_id = data["commit_id"]
        else:
            self.commit_id = self.get_commit_id_by_branch(self.branch)

    def get_commit_id_by_branch(self, branch: str) -> str:
        repo = self.github.get_repo(self.repo)
        branch_info = repo.get_branch(branch)
        return branch_info.commit.sha

    def get_file_content_by_path(self, path: str) -> str:
        repo = self.github.get_repo(self.repo)
        file_content = repo.get_contents(path, ref=self.commit_id)
        self.file_sha = file_content.sha
        return base64.b64decode(file_content.content).decode("utf-8")

    def load(self) -> List[Document]:
        content = self.get_file_content_by_path(self.file_path)
        metadata = {
            "path": self.file_path,
            "source": f"{self.github_api_url}/{self.repo}/blob/"
            f"{self.branch}/{self.file_path}",
        }
        return [Document(page_content=content, metadata=metadata)]
