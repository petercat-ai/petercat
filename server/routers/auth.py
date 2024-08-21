from typing import Annotated
from fastapi import APIRouter, Cookie, Request, HTTPException, status, Response
from fastapi.responses import RedirectResponse
import httpx
from petercat_utils import get_client, get_env_variable

from ..auth.get_user_info import generateAnonymousUser, getAnonymousUserInfoByToken, getUserInfoByToken

AUTH0_DOMAIN = get_env_variable("AUTH0_DOMAIN")

API_AUDIENCE = get_env_variable("API_IDENTIFIER")
CLIENT_ID = get_env_variable("AUTH0_CLIENT_ID")
CLIENT_SECRET = get_env_variable("AUTH0_CLIENT_SECRET")

API_URL =  get_env_variable("API_URL")
CALLBACK_URL = f"{API_URL}/api/auth/callback"
LOGIN_URL = f"{API_URL}/api/auth/login"

WEB_URL =  get_env_variable("WEB_URL")


router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)

async def getTokenByCode(code):
    token_url = f"https://{AUTH0_DOMAIN}/oauth/token"
    headers = {"content-type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "authorization_code",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": code,
        "redirect_uri": CALLBACK_URL,
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(token_url, headers=headers, data=data)
        token_response = response.json()
        print(f"token_response={token_response}")

    if "access_token" not in token_response:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get access token")
    return token_response['access_token']

async def getAnonymousUser(request: Request, response: Response):
    clientId = request.query_params.get("clientId")
    if not clientId:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing clientId")
    token, data = await generateAnonymousUser(clientId)

    supabase = get_client()
    supabase.table("profiles").upsert(data).execute()
    response.set_cookie(key="petercat_user_token", value=token, httponly=True, secure=True, samesite='Lax')
    return { "data": data, "status": 200}

@router.get("/login")
def login():
    redirect_uri = f"https://{AUTH0_DOMAIN}/authorize?audience={API_AUDIENCE}&response_type=code&client_id={CLIENT_ID}&redirect_uri={CALLBACK_URL}&scope=openid%20profile%20email%20read%3Ausers%20read%3Auser_idp_tokens&state=STATE"
    return RedirectResponse(redirect_uri)

@router.get("/callback")
async def callback(request: Request, response: Response):
    print(f"auth_callback: {request.query_params}")
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authorization code")
    token = await getTokenByCode(code)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authorization token")
    data = await getUserInfoByToken(token)
    if data is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authorization token")
    supabase = get_client()
    supabase.table("profiles").upsert(data).execute()
    print(f"auth_callback: {data}, token={token}")
    response = RedirectResponse(url=f'{WEB_URL}', status_code=302)
    response.set_cookie(key="petercat_user_token", value=token, httponly=True, secure=False, samesite='Lax')

    return response

@router.get("/userinfo")
async def userinfo(request: Request, response: Response, petercat_user_token: Annotated[str | None, Cookie()] = None):
    print(f"petercat_user_token: {petercat_user_token}")
    if not petercat_user_token:
        return await getAnonymousUser(request, response)
    data = await getAnonymousUserInfoByToken(petercat_user_token) if petercat_user_token.startswith("client|") else await getUserInfoByToken(petercat_user_token)
    if data is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get access token") 
    if data :
        return { "data": data, "status": 200}
    else:
        return RedirectResponse(url=LOGIN_URL, status_code=303)
