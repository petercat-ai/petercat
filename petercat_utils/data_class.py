from enum import Enum, auto
from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime
from typing import Literal, Optional, List, TypeAlias, Union
from pydantic import BaseModel
from typing import Union


class ImageURL(BaseModel):
    url: str
    """
    The external URL of the image, must be a supported image types: jpeg, jpg, png,
    gif, webp.
    """

    detail: Optional[Literal["auto", "low", "high"]] = None
    """Specifies the detail level of the image.

    `low` uses fewer tokens, you can opt in to high resolution using `high`. Default
    value is `auto`
    """


class ImageURLContentBlock(BaseModel):
    image_url: ImageURL
    type: Literal["image_url"]


class TextContentBlock(BaseModel):
    text: str

    type: Literal["text"]
    """Always `text`."""


MessageContent: TypeAlias = Union[ImageURLContentBlock, TextContentBlock]


class Message(BaseModel):
    role: str
    content: List[MessageContent] = []


class ChatData(BaseModel):
    messages: List[Message] = []
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
    state: Optional[Literal["open", "closed", "all"]] = "all"
    """Filter on issue state. Can be one of: 'open', 'closed', 'all'."""


class GitDocConfig(BaseModel):
    repo_name: str
    """File path of the documentation file. eg:'docs/blog/build-ghost.zh-CN.md'"""
    file_path: Optional[str] = ""
    branch: Optional[str] = "main"
    commit_id: Optional[str] = ""


class RAGGitDocConfig(GitDocConfig):
    bot_id: str


class TaskStatus(Enum):
    NOT_STARTED = auto()
    IN_PROGRESS = auto()
    COMPLETED = auto()
    ON_HOLD = auto()
    CANCELLED = auto()
    ERROR = auto()
