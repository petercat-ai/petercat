from typing import Optional
from pydantic import BaseModel


class DalleData(BaseModel):
    text: str


class Message(BaseModel):
    role: str
    content: str


class ChatData(BaseModel):
    messages: list[Message] = []
    prompt: str = None

class ExecuteMessage(BaseModel):
    type: str
    repo: str
    path: str

class GitRepo(BaseModel):
    repo_name: str
    path: Optional[str] = None
    branch: Optional[str] = None
