from typing import Optional, List
from pydantic import BaseModel

class BotCreateRequest(BaseModel):
    repo_name: str
    starters: Optional[list[str]]
class BotUpdateRequest(BaseModel):
    avatar: Optional[str] = None
    description: Optional[str] = None
    prompt: Optional[str] = None
    files: Optional[List[str]] = None
    enable_img_generation: Optional[bool] = None
    label: Optional[str] = None
    name: Optional[str] = None
    starters: Optional[List[str]] = None
    voice: Optional[str] = None
    public: Optional[bool] = None
