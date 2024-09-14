from datetime import datetime
import json
from pydantic import BaseModel, field_serializer
from typing import Dict, Optional

class Authorization(BaseModel):
    token: str
    installation_id: str
    code: str
    created_at: datetime 
    expires_at: Optional[datetime] = datetime.now().isoformat()

    permissions: Optional[Dict] = {}

    @field_serializer('created_at')
    def serialize_created_at(self, created_at: datetime):
        return created_at.isoformat()

    @field_serializer('expires_at')
    def serialize_expires_at(self, expires_at: datetime):
        return expires_at.isoformat()

    @field_serializer('permissions')
    def serialize_permissions(self, permissions: Dict):
        return json.dumps(permissions)
	