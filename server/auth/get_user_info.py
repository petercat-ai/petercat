from fastapi import Depends, Request
from auth.clients import get_auth_client
from auth.clients.base import BaseAuthClient
from core.models.user import User

from utils.env import get_env_variable

AUTH0_DOMAIN = get_env_variable("AUTH0_DOMAIN")

async def get_user_id(request: Request):
    user_info = request.session.get("user")
    try:
        if user_info is None:
            return None
        return user_info["sub"]

    except Exception:
        return None


async def get_user(request: Request, auth_client: BaseAuthClient = Depends(get_auth_client)) -> User | None:
    user_info = request.session.get("user")
    if user_info is None:
        return None

    if user_info["sub"].startswith("client|"):
        return User(**user_info, anonymous=True)

    access_token = await auth_client.get_access_token(user_id=user_info["sub"])
    return User(**user_info, access_token=access_token, anonymous=False)
