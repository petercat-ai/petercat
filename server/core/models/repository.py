from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class RepositoryConfig(BaseModel):
    id: Optional[str] = None
    repo_name: str
    robot_id: Optional[str] = None
    created_at: datetime 
    owner_id: Optional[str] = None
    repo_id: Optional[str] = None