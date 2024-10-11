from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, field_serializer


class TaskType(Enum):
    WEBSITE = "website"
    MARKET = "market"


class ApprovalStatus(Enum):
    OPEN = "open"
    CLOSED = "closed"


class BotApproval(BaseModel):
    id: Optional[str] = None
    created_at: datetime
    bot_id: Optional[str] = None
    task_type: Optional[TaskType] = None
    approval_status: Optional[ApprovalStatus] = None
    approval_path: Optional[str] = None

    @field_serializer("created_at")
    def serialize_created_at(self, created_at: datetime):
        return created_at.isoformat()

    @field_serializer("task_type")
    def serialize_task_type(self, task_type: TaskType) -> str:
        return task_type.value

    @field_serializer("approval_status")
    def serialize_approval_status(self, approval_status: ApprovalStatus) -> str:
        return approval_status.value
