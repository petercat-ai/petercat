import secrets
from fastapi import Request
from fastapi.responses import RedirectResponse
from petercat_utils import get_client, get_env_variable
from auth.clients.base import BaseAuthClient

PETERCAT_LOCAL_UID = get_env_variable("PETERCAT_LOCAL_UID")
PETERCAT_LOCAL_UNAME = get_env_variable("PETERCAT_LOCAL_UNAME")
WEB_URL = get_env_variable("WEB_URL")
WEB_LOGIN_SUCCESS_URL = f"{WEB_URL}/user/login"

class LocalClient(BaseAuthClient):
  def __init__(self):
    pass
  
  async def login(self, request: Request):
    data = await self.get_user_info()
    supabase = get_client()
    supabase.table("profiles").upsert(data).execute()
    request.session["user"] = data
  
    return RedirectResponse(url=f"{WEB_LOGIN_SUCCESS_URL}", status_code=302)
  
  async def get_user_info(user_id):
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
      "agreement_accepted": False,
    }

