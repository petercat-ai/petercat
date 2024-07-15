from typing import Literal, Optional
from pydantic import BaseModel


class DalleData(BaseModel):
    text: str


class Message(BaseModel):
    role: str
    content: str


class ChatData(BaseModel):
    messages: list[Message] = []
    prompt: Optional[str] = None
    bot_id: Optional[str] = None

class ExecuteMessage(BaseModel):
    type: str
    repo: str
    path: str

class S3Config(BaseModel):
    s3_bucket: str
    file_path: Optional[str] = None

class GitIssueConfig(BaseModel):
    repo_name: str
    page: Optional[int] = None
    """The page number for paginated results.
        Defaults to 1 in the GitHub API."""
    per_page: Optional[int] = 30
    """Number of items per page.
        Defaults to 30 in the GitHub API."""
    state: Optional[Literal["open", "closed", "all"]] = 'all'
    """Filter on issue state. Can be one of: 'open', 'closed', 'all'."""


class GitDocConfig(BaseModel):
    repo_name: str
    """File path of the documentation file. eg:'docs/blog/build-ghost.zh-CN.md'"""
    file_path: Optional[str] = '',
    branch: Optional[str] = 'main'
    commit_id: Optional[str] = '',
    bot_id: Optional[str] = '',
