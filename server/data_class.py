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

class S3Config(BaseModel):
    s3_bucket: str
    file_path: Optional[str] = None
