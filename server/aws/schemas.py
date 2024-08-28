from pydantic import BaseModel
from typing import Optional


class ImageMetaData(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
