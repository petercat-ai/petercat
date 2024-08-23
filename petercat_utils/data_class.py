from enum import Enum, auto
from typing import Literal, Optional, List, TypeAlias
from typing import Union

from pydantic import BaseModel


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

class ImageRawURLContentBlock(BaseModel):
    image_url: str
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
    llm: Optional[str] = "openai"
    prompt: Optional[str] = None
    bot_id: Optional[str] = None


class ExecuteMessage(BaseModel):
    type: str
    repo: str
    path: str


class S3Config(BaseModel):
    s3_bucket: str
    file_path: Optional[str] = None


class GitDocConfig(BaseModel):
    repo_name: str
    """File path of the documentation file. eg:'docs/blog/build-ghost.zh-CN.md'"""
    file_path: Optional[str] = ""
    branch: Optional[str] = "main"
    commit_id: Optional[str] = ""


class RAGGitDocConfig(GitDocConfig):
    bot_id: str


class GitIssueConfig(BaseModel):
    repo_name: str
    issue_id: str


class RAGGitIssueConfig(GitIssueConfig):
    bot_id: str


class AutoNameEnum(Enum):
    def _generate_next_value_(name, start, count, last_values):
        return name


class TaskStatus(AutoNameEnum):
    NOT_STARTED = auto()
    IN_PROGRESS = auto()
    COMPLETED = auto()
    ON_HOLD = auto()
    CANCELLED = auto()
    ERROR = auto()


class TaskType(AutoNameEnum):
    GIT_DOC = auto()
    GIT_ISSUE = auto()


class GitDocTaskNodeType(AutoNameEnum):
    TREE = auto()
    BLOB = auto()


class GitIssueTaskNodeType(AutoNameEnum):
    REPO = auto()
    ISSUE = auto()
