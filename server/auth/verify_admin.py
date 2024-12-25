from typing import Annotated

from fastapi import Depends, HTTPException, Request

from auth.get_user_info import get_user
from core.models.user import User

async def verify_admin(request: Request, user: Annotated[User | None, Depends(get_user)] = None,):
    if not user or not user.is_admin:
      raise HTTPException(status_code=403, detail="Must Login")
    