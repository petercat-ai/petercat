import secrets

from abc import abstractmethod
from fastapi import Request
from utils.random_str import random_str
from petercat_utils import get_client


class BaseAuthClient:
  def __init__(self):
    pass

  def generateAnonymousUser(self, clientId: str) -> tuple[str, dict]:
    token = f"client|{clientId}"
    seed = clientId[:4]
    random_name = f"{seed}_{random_str(4)}"
    data = {
        "id": token,
        "sub": token,
        "nickname": random_name,
        "name": random_name,
        "picture": f"https://picsum.photos/seed/{seed}/100/100",
        "sid": secrets.token_urlsafe(32),
        "agreement_accepted": False,
    }

    return token, data

  async def anonymouseLogin(self, request: Request) -> dict:
    clientId = request.query_params.get("clientId") or random_str()
    token, data = self.generateAnonymousUser(clientId = clientId)
    supabase = get_client()
    supabase.table("profiles").upsert(data).execute()
    request.session["user"] = data
    return data

  @abstractmethod
  async def login(self, request: Request):
    pass

  @abstractmethod
  async def get_oauth_token(self) -> str:
    pass

  @abstractmethod
  async def get_user_info(self, request: Request) -> dict:
    pass
  
  @abstractmethod
  async def get_access_token(self, user_id: str, provider="github") -> str:
    pass