
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
class UserLLMToken(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None
    created_at: Optional[datetime] = datetime.now().isoformat()
    slug: Optional[str] = None
    llm: str
    encrypted_token: Optional[str] = None
    sanitized_token: Optional[str] = None
