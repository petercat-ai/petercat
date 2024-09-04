from typing import Annotated
from fastapi import APIRouter, Depends, File, UploadFile, Form

from auth.get_user_info import get_user
from core.models.user import User
from .schemas import ImageMetaData
from .dependencies import get_s3_client
from .service import upload_image_to_s3


ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}

router = APIRouter(
    prefix="/api/aws",
    tags=["aws"],
    responses={404: {"description": "Not found"}},
)

@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    title: str = Form(None),
    description: str = Form(None),
    s3_client=Depends(get_s3_client),
    user: Annotated[User | None, Depends(get_user)] = None,
):  
    
    metadata = ImageMetaData(title=title, description=description)
    result = upload_image_to_s3(file, metadata, s3_client)
    return {"status": "success", "data": result}
