from typing import Optional, List
from pydantic import BaseModel

class BotCreateRequest(BaseModel):
    repo_name: str
    starters: Optional[List[str]] = ["介绍一下项目", "快速上手", "贡献指南"],
    hello_message: Optional[str] = "我是答疑机器人，答疑机器人能够快速响应用户需求，并解决实际问题。"
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
