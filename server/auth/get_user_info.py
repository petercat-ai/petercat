from uilts.env import get_env_variable
import httpx
import secrets


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
                "sub": user_info["sub"],
                "sid": secrets.token_urlsafe(32)
            }
            return data
        else :
            return {}