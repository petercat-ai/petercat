from datetime import datetime
from typing import Optional
from pydantic import BaseModel
import time

class Bot(BaseModel):
    id: str
    uid: str
    avatar: Optional[str] = ""
    description: Optional[str]
    prompt: Optional[str] = ""
    name: str
    llm: Optional[str] = "openai"
    created_at: datetime = int(time.time())