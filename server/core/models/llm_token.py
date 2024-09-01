
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class LLMToken(BaseModel):
    id: Optional[int]
    created_at: datetime 
    slug: str
    limit: Optional[int]
    usage: Optional[int]
    free: bool
    llm: str
    token: str