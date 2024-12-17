from fastapi import Request
from auth.clients import get_auth_client
from core.models.user import User

from petercat_utils import get_env_variable

AUTH0_DOMAIN = get_env_variable("AUTH0_DOMAIN")

async def getUserAccessToken(user_id: str, provider="github"):
    auth_client = get_auth_client()
    return await auth_client.get_access_token(user_id=user_id, provider=provider)

async def get_user_id(request: Request):
    user_info = request.session.get("user")
    try:
        if user_info is None:
            return None
        return user_info["sub"]

    except Exception:
        return None


async def get_user(request: Request) -> User | None:
    user_info = request.session.get("user")
    if user_info is None:
        return None

    if user_info["sub"].startswith("client|"):
        return User(**user_info, anonymous=True)

    access_token = await getUserAccessToken(user_id=user_info["sub"])
    return User(**user_info, access_token=access_token, anonymous=False)
