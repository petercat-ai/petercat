from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class Bot(BaseModel):
    id: str
    uid: str
    avatar: Optional[str] = ""
    description: Optional[str]
    prompt: Optional[str] = ""
    name: str
    llm: Optional[str] = "openai"
    created_at: datetime = datetime.now()