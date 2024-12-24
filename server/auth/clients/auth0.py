import httpx
import secrets

from fastapi import Request
from auth.clients.base import BaseAuthClient
from petercat_utils import get_env_variable
from starlette.config import Config
from authlib.integrations.starlette_client import OAuth

CLIENT_ID = get_env_variable("AUTH0_CLIENT_ID")
CLIENT_SECRET = get_env_variable("AUTH0_CLIENT_SECRET")
AUTH0_DOMAIN = get_env_variable("AUTH0_DOMAIN")
API_AUDIENCE = get_env_variable("API_IDENTIFIER")
API_URL = get_env_variable("API_URL")

CALLBACK_URL = f"{API_URL}/api/auth/callback"

config = Config(
    environ={
        "AUTH0_CLIENT_ID": CLIENT_ID,
        "AUTH0_CLIENT_SECRET": CLIENT_SECRET,
    }
)

class Auth0Client(BaseAuthClient):
  _client: OAuth

  def __init__(self):
    self._client = OAuth(config)
    self._client.register(
        name="auth0",
        server_metadata_url=f"https://{AUTH0_DOMAIN}/.well-known/openid-configuration",
        client_kwargs={"scope": "openid email profile"},
    )

  async def login(self, request):
    return await self._client.auth0.authorize_redirect(
        request, redirect_uri=CALLBACK_URL
    )

  async def get_oauth_token(self):
    url = f'https://{AUTH0_DOMAIN}/oauth/token'
    headers = {"content-type": "application/x-www-form-urlencoded"}
    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'audience': API_AUDIENCE,
        'grant_type': 'client_credentials'
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, data=data, headers=headers)
        return response.json()['access_token']

  async def get_user_info(self, request: Request) -> dict:
    auth0_token = await self._client.auth0.authorize_access_token(request)
    access_token = auth0_token["access_token"]
    userinfo_url = f"https://{AUTH0_DOMAIN}/userinfo"
    headers = {"authorization": f"Bearer {access_token}"}
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
                "sid": secrets.token_urlsafe(32),
            }
            return data
        else:
            return None

  async def get_access_token(self, user_id: str, provider="github"):
    token = await self.get_oauth_token()
    user_accesstoken_url = f"https://{AUTH0_DOMAIN}/api/v2/users/{user_id}"

    async with httpx.AsyncClient() as client:
        headers = {"authorization": f"Bearer {token}"}
        user_info_response = await client.get(user_accesstoken_url, headers=headers)
        user = user_info_response.json()
        identity = next(
            (
                identity
                for identity in user["identities"]
                if identity["provider"] == provider
            ),
            None,
        )
        return identity["access_token"]