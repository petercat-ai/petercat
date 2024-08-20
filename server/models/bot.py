from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class Bot(BaseModel):
    id: str
    uid: str
    avatar: str
    description: str
    prompt: str
    name: str
    llm: str
    created_at: datetime 