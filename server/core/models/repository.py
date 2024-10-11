from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_serializer


class RepositoryConfig(BaseModel):
    id: Optional[str] = None
    repo_name: str
    robot_id: Optional[str] = None
    created_at: datetime
    owner_id: Optional[str] = None
    repo_id: Optional[str] = None

    @field_serializer("created_at")
    def serialize_created_at(self, created_at: datetime):
        return created_at.isoformat()
