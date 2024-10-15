from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class BotModel(BaseModel):
    id: str
    uid: str
    avatar: Optional[str] = ""
    description: Optional[str]
    prompt: Optional[str] = ""
    name: str
    public: bool = False
    llm: Optional[str] = "openai"
    token_id: Optional[str] = ""
    created_at: datetime = datetime.now()
    domain_whitelist: Optional[list[str]] = []
    repo_name: str = ""


class RepoBindBotConfigVO(BaseModel):
    repo_id: str
    robot_id: Optional[str] = ""


class RepoBindBotRequest(BaseModel):
    repos: list[RepoBindBotConfigVO]
