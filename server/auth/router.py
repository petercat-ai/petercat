from fastapi import APIRouter, Request, HTTPException, status
from fastapi.responses import RedirectResponse
import secrets
from petercat_utils import get_client, get_env_variable
from starlette.config import Config
from authlib.integrations.starlette_client import OAuth

from auth.get_user_info import generateAnonymousUser, getUserInfoByToken

AUTH0_DOMAIN = get_env_variable("AUTH0_DOMAIN")

API_AUDIENCE = get_env_variable("API_IDENTIFIER")
CLIENT_ID = get_env_variable("AUTH0_CLIENT_ID")
CLIENT_SECRET = get_env_variable("AUTH0_CLIENT_SECRET")

API_URL =  get_env_variable("API_URL")
CALLBACK_URL = f"{API_URL}/api/auth/callback"
LOGIN_URL = f"{API_URL}/api/auth/login"

WEB_URL =  get_env_variable("WEB_URL")
MARKET_URL = f"{WEB_URL}/market"

config = Config(environ={
    "AUTH0_CLIENT_ID": CLIENT_ID,
    "AUTH0_CLIENT_SECRET": CLIENT_SECRET,
})

oauth = OAuth(config)
oauth.register(
    name="auth0",
    server_metadata_url=f'https://{AUTH0_DOMAIN}/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)

async def getAnonymousUser(request: Request):
    clientId = request.query_params.get("clientId")
    if not clientId:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing clientId")
    token, data = await generateAnonymousUser(clientId)

    supabase = get_client()
    supabase.table("profiles").upsert(data).execute()
    request.session['user'] = data
    return data

@router.get("/login")
async def login(request: Request):
    redirect_response = await oauth.auth0.authorize_redirect(request, redirect_uri=CALLBACK_URL)
    return redirect_response

@router.get('/logout')
async def logout(request: Request):
    request.session.pop('user', None)
    return RedirectResponse(url=MARKET_URL)

@router.get("/callback")
async def callback(request: Request):
    auth0_token = await oauth.auth0.authorize_access_token(request)
    user_info = await getUserInfoByToken(token=auth0_token['access_token'])

    if user_info:
        request.session['user'] = dict(user_info)
        data = {
            "id": user_info["sub"],
            "nickname": user_info.get("nickname"),
            "name": user_info.get("name"),
            "picture": user_info.get("picture"),
            "sub": user_info["sub"],
            "sid": secrets.token_urlsafe(32)
        }
        supabase = get_client()
        supabase.table("profiles").upsert(data).execute()
    return RedirectResponse(url=f'{MARKET_URL}', status_code=302)

@router.get("/userinfo")
async def userinfo(request: Request):
    user = request.session.get('user')

    if not user:
        data = await getAnonymousUser(request)
        return { "data": data, "status": 200}
    return { "data": user, "status": 200}
