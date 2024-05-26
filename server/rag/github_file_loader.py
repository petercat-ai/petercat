
"""
This file was originally sourced from the https://github.com/langchain-ai/langchain/blob/master/libs/community/langchain_community/document_loaders/github.py
and it has been modified based on the requirements provided by petercat.
"""

import base64
from abc import ABC
from typing import Callable, Dict, Iterator, List, Optional
import requests
from langchain_core.documents import Document
from langchain_core.pydantic_v1 import BaseModel, root_validator
from langchain_core.utils import get_from_dict_or_env

from langchain_community.document_loaders.base import BaseLoader


class BaseGitHubLoader(BaseLoader, BaseModel, ABC):
    """Load `GitHub` repository Issues. """

    repo: str
    """Name of repository"""
    access_token: str
    """Personal access token - see https://github.com/settings/tokens?type=beta"""
    github_api_url: str = "https://api.github.com"
    """URL of GitHub API"""

    @root_validator(pre=True, allow_reuse=True)
    def validate_environment(cls, values: Dict) -> Dict:
        """Validate that access token exists in environment."""
        values["access_token"] = get_from_dict_or_env(
            values, "access_token", "GITHUB_PERSONAL_ACCESS_TOKEN"
        )
        return values

    @property
    def headers(self) -> Dict[str, str]:
        return {
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {self.access_token}",
        }


class GithubFileLoader(BaseGitHubLoader, ABC):
    """Load GitHub File"""
    file_path: str
    file_extension: str = ".md"
    branch: str = "main"
    file_filter: Optional[Callable[[str], bool]]
    commit_id: str = None
    file_sha: str = None

    def __init__(self, **data: Dict):
        super().__init__(**data)
        if (data.get('commit_id')):
            self.commit_id = data.get('commit_id')
        else:
            self.commit_id = self.get_commit_id_by_branch(self.branch)

    def get_commit_id_by_branch(self, branch: str) -> str:
        branch_url = f"{self.github_api_url}/repos/{self.repo}/branches/{branch}"
        response = requests.get(branch_url, headers=self.headers)
        response.raise_for_status()

        branch_info = response.json()
        return branch_info['commit']['sha']

    def get_file_content_by_path(self, path: str) -> str:
        base_url = f"{self.github_api_url}/repos/{self.repo}/contents/{path}?ref={self.commit_id}"
        response = requests.get(base_url, headers=self.headers)
        response.raise_for_status()

        if isinstance(response.json(), dict):
            result = response.json()
            content_encoded = result["content"]
            self.file_sha = result["sha"]
            return base64.b64decode(content_encoded).decode("utf-8")

        return None

    def load(self) -> List[Document]:
        content = self.get_file_content_by_path(self.file_path)

        metadata = {
            "path": self.file_path,
            "source": f"{self.github_api_url}/{self.repo}/blob/"
            f"{self.branch}/{self.file_path}",
        }
        return [Document(page_content=content, metadata=metadata)]
