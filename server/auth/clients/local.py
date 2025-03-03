import secrets
from fastapi import Request
from fastapi.responses import RedirectResponse
from core.dao.profilesDAO import ProfilesDAO
from utils.env import get_env_variable
from auth.clients.base import BaseAuthClient

PETERCAT_LOCAL_UID = get_env_variable("PETERCAT_LOCAL_UID")
PETERCAT_LOCAL_UNAME = get_env_variable("PETERCAT_LOCAL_UNAME")
PETERCAT_LOCAL_GITHUB_TOKEN = get_env_variable("PETERCAT_LOCAL_GITHUB_TOKEN")
WEB_URL = get_env_variable("WEB_URL")
WEB_LOGIN_SUCCESS_URL = f"{WEB_URL}/user/login"

class LocalClient(BaseAuthClient):
  def __init__(self):
    pass

  async def login(self, request: Request):
    data = await self.get_user_info()
    profiles_dao = ProfilesDAO()
    profiles_dao.upsert_user(data)
    request.session["user"] = data

    return RedirectResponse(url=f"{WEB_LOGIN_SUCCESS_URL}", status_code=302)

  async def logout(self, request: Request, redirect: str):
    if redirect:
      return RedirectResponse(url=f"{redirect}", status_code=302)
    return {"success": True}

  async def get_user_info(self, user_id):
    token = PETERCAT_LOCAL_UID
    username = PETERCAT_LOCAL_UNAME
    seed = token[:4]

    return {
      "id": token,
      "sub": token,
      "nickname": username,
      "name": username,
      "picture": f"https://picsum.photos/seed/{seed}/100/100",
      "sid": secrets.token_urlsafe(32),
    }


  async def get_access_token(self, user_id):
    return PETERCAT_LOCAL_GITHUB_TOKEN