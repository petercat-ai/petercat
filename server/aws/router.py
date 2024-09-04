from typing import Annotated
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, Form, status

from auth.get_user_info import get_user
from core.models.user import User
from .schemas import ImageMetaData
from .dependencies import get_s3_client
from .service import upload_image_to_s3
import magic


ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}

router = APIRouter(
    prefix="/api/aws",
    tags=["aws"],
    responses={404: {"description": "Not found"}},
)


def is_allowed_file(file: UploadFile) -> bool:
    mime = magic.Magic(mime=True)
    mime_type = mime.from_buffer(file.file.read(2048))
    file.file.seek(0)  # 重新定位到文件开头
    return mime_type in ALLOWED_MIME_TYPES

@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    title: str = Form(None),
    description: str = Form(None),
    s3_client=Depends(get_s3_client),
    user: Annotated[User | None, Depends(get_user)] = None,
):  
    
    if user is None or user.anonymous:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Need Login")
    
    if not is_allowed_file(file):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file type")
    
    metadata = ImageMetaData(title=title, description=description)
    result = upload_image_to_s3(file, metadata, s3_client)
    return {"status": "success", "data": result}
