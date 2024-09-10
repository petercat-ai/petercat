from typing import Optional, List
from pydantic import BaseModel

class BotCreateRequest(BaseModel):
    repo_name: str
    starters: Optional[List[str]] = None
    hello_message: Optional[str] = None

class BotUpdateRequest(BaseModel):
    id: str
    avatar: Optional[str] = None
    description: Optional[str] = None
    prompt: Optional[str] = None
    name: Optional[str] = None
    starters: Optional[List[str]] = None
    public: Optional[bool] = None
    hello_message: Optional[str] = None
    llm: Optional[str] = None
    token_id: Optional[str] = None

class ErrorResponse(BaseModel):
    error: str
    status: int
