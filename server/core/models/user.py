from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class User(BaseModel):
    id: str
    sub: str
    sid: str
    nickname: str
    avatar: datetime 
    picture: Optional[str]

    anonymous: Optional[bool] = True
    access_token: Optional[str]
