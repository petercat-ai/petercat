from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class UserTokenUsage(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None
    token_id: Optional[str] = None
    bot_id: Optional[str] = None
    created_at: Optional[datetime] = datetime.now().isoformat()
    date: Optional[datetime] = datetime.now().date().isoformat()
    input_token: Optional[int] = 0
    output_token: Optional[int] = 0
    total_token: Optional[int] = 0


class UserTokenUsageStats(BaseModel):
    usage_date: datetime
    input_tokens: Optional[int] = 0
    output_tokens: Optional[int] = 0
    total_tokens: Optional[int] = 0


class BotTokenUsageStats(BaseModel):
    bot_id: str
    bot_name: str
    usage_date: datetime
    input_tokens: Optional[int] = 0
    output_tokens: Optional[int] = 0
    total_tokens: Optional[int] = 0

class BotTokenUsageRate(BaseModel):
    bot_id: str
    bot_name: str
    input_tokens: Optional[int] = 0
    output_tokens: Optional[int] = 0
    total_tokens: Optional[int] = 0

class UserTokenUsageRate(BaseModel):
    user_id: str
    user_name: str
    input_tokens: Optional[int] = 0
    output_tokens: Optional[int] = 0
    total_tokens: Optional[int] = 0