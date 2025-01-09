from pydantic import BaseModel
from typing import Optional, Any


class ResponseModel(BaseModel):
    success: bool
    data: Optional[Any] = None
    message: Optional[str] = None
