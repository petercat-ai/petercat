from typing import Optional, List
from pydantic import BaseModel

class BotCreateRequest(BaseModel):
    uid: str
    avatar: Optional[str] = None
    description: Optional[str] = None
    prompt: Optional[str] = None
    files: Optional[List[str]] = None  # 假设为文件的URL或标识符列表
    enable_img_generation: Optional[bool] = None
    label: Optional[str] = None
    name: Optional[str] = None
    starters: Optional[List[str]] = None  # 假设为起始文本列表
    voice: Optional[str] = None
    public: Optional[bool] = False
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
