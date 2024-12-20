from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Profiles(BaseModel):
    id: str
    created_at: datetime = datetime.now()
    nickname: Optional[str] = ""
    name: Optional[str] = ""
    picture: Optional[str] = ""
    sid: Optional[str] = ""
    sub: Optional[str] = ""
    agreement_accepted: Optional[bool] = False
