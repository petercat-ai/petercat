from fastapi import APIRouter,Cookie, Request, HTTPException, status, Response

from fastapi.responses import RedirectResponse
import httpx

from db.supabase.client import get_client
from auth.get_user_info import generateAnonymousUser, getAnonymousUserInfoByToken, getUserInfoByToken
from uilts.env import get_env_variable

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
    print(f'redirect_uri={CALLBACK_URL}')
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
    response = RedirectResponse(url=f'{WEB_URL}', status_code=302)
    response.set_cookie(key="petercat_user_token", value=token, httponly=True, secure=True, samesite='Lax')
    return response

@router.get("/userinfo")
async def userinfo(request: Request, response: Response, petercat_user_token: str = Cookie(None)):
    if not petercat_user_token:
        return await getAnonymousUser(request, response)
    data = await getAnonymousUserInfoByToken(petercat_user_token) if petercat_user_token.startswith("client|") else await getUserInfoByToken(petercat_user_token)
    if data is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get access token") 
    if data :
        response.set_cookie(key="user_id", value=data['id'], httponly=True, secure=True, samesite='Lax')
        return { "data": data, "status": 200}
    else:
        return RedirectResponse(url=LOGIN_URL, status_code=303)


@router.get("/get_user_id")
async def get_user_id(user_id: str = Cookie(None)):
    if user_id is None:
        raise HTTPException(status_code=403, detail="Cookie not found")
    return {"user_id": user_id}