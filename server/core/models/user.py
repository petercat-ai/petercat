from typing import Optional
from pydantic import BaseModel

class User(BaseModel):
    id: Optional[str] = None
    sub: str
    sid: str
    nickname: str
    avatar: Optional[str] = None
    picture: Optional[str]
    agreement_token: Optional[bool] = False

    anonymous: Optional[bool] = True
    access_token: Optional[str] = None
