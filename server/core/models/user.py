from typing import Optional
from pydantic import BaseModel

class User(BaseModel):
    id: Optional[str]
    sub: str
    sid: str
    nickname: str
    avatar: Optional[str] 
    picture: Optional[str]

    anonymous: Optional[bool] = True
    access_token: Optional[str]
