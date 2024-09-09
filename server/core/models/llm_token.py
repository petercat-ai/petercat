
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
class LLMToken(BaseModel):
    id: Optional[int] = None
    user_id: Optional[str] = None
    created_at: Optional[datetime] = None
    slug: Optional[str] = None
    limit: Optional[int] = None
    usage: Optional[int] = None
    free: Optional[bool] = False
    llm: str
    token: Optional[str] = None