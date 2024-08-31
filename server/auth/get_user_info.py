from fastapi import Request
import httpx
import secrets
from core.models.user import User

from utils.random_str import random_str

from .get_oauth_token import get_oauth_token
from petercat_utils import get_client, get_env_variable


AUTH0_DOMAIN = get_env_variable("AUTH0_DOMAIN")

async def getUserInfoByToken(token):
    userinfo_url = f"https://{AUTH0_DOMAIN}/userinfo"
    
    headers = {"authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        user_info_response = await client.get(userinfo_url, headers=headers)
        if user_info_response.status_code == 200:
            user_info = user_info_response.json()
            data = {
                "id": user_info["sub"],
                "nickname": user_info.get("nickname"),
                "name": user_info.get("name"),
                "picture": user_info.get("picture"),
                "avatar": user_info.get("picture"),
                "sub": user_info["sub"],
                "sid": secrets.token_urlsafe(32)
            }
            return data
        else :
            return None

async def getUserAccessToken(user_id: str, provider = 'github'):
    token = await get_oauth_token()
    user_accesstoken_url = f"https://{AUTH0_DOMAIN}/api/v2/users/{user_id}"

    async with httpx.AsyncClient() as client:
        headers = {"authorization": f"Bearer {token}"}
        user_info_response = await client.get(user_accesstoken_url, headers=headers)
        user = user_info_response.json()
        identity = next((identity for identity in user['identities'] if identity['provider'] == provider), None)
        return identity['access_token']

async def generateAnonymousUser(clientId: str):
    token = f"client|{clientId}"
    seed = clientId[:4]
    random_name = f"{seed}_{random_str(4)}"
    data = {
        "id": token,
        "sub": token,
        "nickname": random_name,
        "name": random_name,
        "picture": f"https://picsum.photos/seed/{seed}/100/100",
        "sid": secrets.token_urlsafe(32)
    }

    return token, data

async def getAnonymousUserInfoByToken(token: str):
    supabase = get_client()
    rows = supabase.table("profiles").select("*").eq("id", token).execute()
    return rows.data[0] if (len(rows.data) > 0) else None

async def get_user_id(request: Request):
    user_info = request.session.get('user')
    try:
        if user_info is None:
            return None
        return user_info['sub'] 

    except Exception:
        return None

async def get_user(request: Request) -> User | None:
    try:
        user_info = request.session.get('user')
        if user_info is None:
            return None
    
        if user_info.sub.startswith("client|"):
            return User(**user_info, anonymous=True)
        
        access_token = await getUserAccessToken(user_id=user_info['sub'])

        return User(**user_info, access_token=access_token, anonymous=False)
    except Exception:
        return None