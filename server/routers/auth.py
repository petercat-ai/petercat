from fastapi import APIRouter,Cookie, Depends, Security, Request, HTTPException, status, Response
from uilts.env import get_env_variable
from fastapi_auth0 import Auth0, Auth0User
from fastapi.responses import RedirectResponse, JSONResponse
import httpx
from db.supabase.client import get_client
import secrets

AUTH0_DOMAIN = get_env_variable("AUTH0_DOMAIN")

API_AUDIENCE = get_env_variable("API_IDENTIFIER")
CLIENT_ID = get_env_variable("AUTH0_CLIENT_ID")
CLIENT_SECRET = get_env_variable("AUTH0_CLIENT_SECRET")

API_URL =  get_env_variable("API_URL")
CALLBACK_URL = f"{API_URL}/api/auth/callback"
LOGIN_URL = f"{API_URL}/api/auth/login"

WEB_URL =  get_env_variable("WEB_URL")


auth = Auth0(domain=AUTH0_DOMAIN, api_audience=API_AUDIENCE, scopes={'read': 'get list'})

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)

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

    if "access_token" not in token_response:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get access token")
    return token_response['access_token']


@router.get("/login")
def login():
    redirect_uri = f"https://{AUTH0_DOMAIN}/authorize?audience={API_AUDIENCE}&response_type=code&client_id={CLIENT_ID}&redirect_uri={CALLBACK_URL}&scope=openid profile email&state=STATE"
    return RedirectResponse(redirect_uri)

@router.get("/callback")
async def callback(request: Request, response: Response):
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authorization code")
    token = await getTokenByCode(code)
    data = await getUserInfoByToken(token)
    
    supabase = get_client()
    supabase.table("profiles").upsert(data).execute()
    response = RedirectResponse(url=f'{WEB_URL}', status_code=302)  # 303 See Other 确保正确处理 POST 到 GET 的重定向
    response.set_cookie(key="petercat", value=token, httponly=True, secure=True, samesite='Lax')
    return response

@router.get("/userinfo")
async def userinfo(petercat: str = Cookie(None)):
    if not petercat:
        return RedirectResponse(url=LOGIN_URL, status_code=303)
    data = await getUserInfoByToken(petercat)
    if data :
        return { "data": data, "status": 200}
    else:
        return RedirectResponse(url=LOGIN_URL, status_code=303)