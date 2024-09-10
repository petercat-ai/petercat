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
    llm: Optional[str] = "openai"
    token_id: Optional[str] = ""
    created_at: datetime = datetime.now()
    domain_whitelist: Optional[list[str]] = []