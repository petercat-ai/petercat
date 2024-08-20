from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class Bot(BaseModel):
    uid: str
    avatar: str
    description: str
    prompt: str
    name: str
    created_at: datetime 