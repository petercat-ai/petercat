from github import Github
from core.dao.profilesDAO import ProfilesDAO
from fastapi import APIRouter, Request, HTTPException, status, Depends
from fastapi.responses import RedirectResponse, JSONResponse
import secrets
from petercat_utils import get_client, get_env_variable
from starlette.config import Config
from authlib.integrations.starlette_client import OAuth
from typing import Annotated, Optional

from auth.get_user_info import (
    generateAnonymousUser,
    getUserAccessToken,
    getUserInfoByToken,
    get_user_id,
)

AUTH0_DOMAIN = get_env_variable("AUTH0_DOMAIN")

API_AUDIENCE = get_env_variable("API_IDENTIFIER")
CLIENT_ID = get_env_variable("AUTH0_CLIENT_ID")
CLIENT_SECRET = get_env_variable("AUTH0_CLIENT_SECRET")

API_URL = get_env_variable("API_URL")
CALLBACK_URL = f"{API_URL}/api/auth/callback"
LOGIN_URL = f"{API_URL}/api/auth/login"

WEB_URL = get_env_variable("WEB_URL")
WEB_LOGIN_SUCCESS_URL = f"{WEB_URL}/user/login"
MARKET_URL = f"{WEB_URL}/market"

config = Config(
    environ={
        "AUTH0_CLIENT_ID": CLIENT_ID,
        "AUTH0_CLIENT_SECRET": CLIENT_SECRET,
    }
)

oauth = OAuth(config)
oauth.register(
    name="auth0",
    server_metadata_url=f"https://{AUTH0_DOMAIN}/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)


async def getAnonymousUser(request: Request):
    clientId = request.query_params.get("clientId")
    if not clientId:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing clientId"
        )
    token, data = await generateAnonymousUser(clientId)

    supabase = get_client()
    supabase.table("profiles").upsert(data).execute()
    request.session["user"] = data
    return data


@router.get("/login")
async def login(request: Request):
    if CLIENT_ID is None:
        return {
            "message": "enviroments CLIENT_ID and CLIENT_SECRET required.",
        }
    redirect_response = await oauth.auth0.authorize_redirect(
        request, redirect_uri=CALLBACK_URL
    )
    return redirect_response


@router.get("/logout")
async def logout(request: Request):
    request.session.pop("user", None)
    redirect = request.query_params.get("redirect")
    if redirect:
        return RedirectResponse(url=f"{redirect}", status_code=302)
    return {"success": True}


@router.get("/callback")
async def callback(request: Request):
    auth0_token = await oauth.auth0.authorize_access_token(request)
    user_info = await getUserInfoByToken(token=auth0_token["access_token"])

    if user_info:
        data = {
            "id": user_info["sub"],
            "nickname": user_info.get("nickname"),
            "name": user_info.get("name"),
            "picture": user_info.get("picture"),
            "sub": user_info["sub"],
            "sid": secrets.token_urlsafe(32),
            "agreement_accepted": user_info.get("agreement_accepted"),
        }
        request.session["user"] = dict(data)
        supabase = get_client()
        supabase.table("profiles").upsert(data).execute()
    return RedirectResponse(url=f"{WEB_LOGIN_SUCCESS_URL}", status_code=302)


@router.get("/userinfo")
async def userinfo(request: Request):
    user = request.session.get("user")
    if not user:
        data = await getAnonymousUser(request)
        return {"data": data, "status": 200}
    return {"data": user, "status": 200}


@router.get("/agreement/status")
async def get_agreement_status(user_id: Optional[str] = Depends(get_user_id)):
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")
    try:
        profiles_dao = ProfilesDAO()
        response = profiles_dao.get_agreement_status(user_id=user_id)
        if not response:
            raise HTTPException(
                status_code=404, detail="User does not exist, accept failed."
            )
        return {"success": True, "data": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.post("/accept/agreement", status_code=200)
async def bot_generator(
    request: Request,
    user_id: Annotated[str | None, Depends(get_user_id)] = None,
):
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")
    try:
        profiles_dao = ProfilesDAO()
        response = profiles_dao.accept_agreement(user_id=user_id)
        if response:
            request.session["user"] = response
            return JSONResponse(content={"success": True})
        else:
            raise HTTPException(status_code=400, detail="User update failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.get("/repos")
async def get_user_repos(user_id: Optional[str] = Depends(get_user_id)):
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")
    try:
        access_token = await getUserAccessToken(user_id=user_id)
        g = Github(access_token)
        user = g.get_user()
        repos = user.get_repos()

        repo_names = [
            {"name": repo.full_name} for repo in repos if repo.permissions.maintain
        ]
        return {"data": repo_names, "status": 200}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
