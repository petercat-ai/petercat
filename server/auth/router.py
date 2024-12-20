from typing import Annotated, Optional

from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import RedirectResponse, JSONResponse
from github import Github


from auth.clients import get_auth_client
from auth.clients.base import BaseAuthClient
from auth.get_user_info import get_user_id
from core.dao.profilesDAO import ProfilesDAO
from petercat_utils import get_client, get_env_variable

API_URL = get_env_variable("API_URL")
WEB_URL = get_env_variable("WEB_URL")

CALLBACK_URL = f"{API_URL}/api/auth/callback"
LOGIN_URL = f"{API_URL}/api/auth/login"

WEB_LOGIN_SUCCESS_URL = f"{WEB_URL}/user/login"
MARKET_URL = f"{WEB_URL}/market"


router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)

@router.get("/login")
async def login(request: Request, auth_client = Depends(get_auth_client)):
    return await auth_client.login(request)

@router.get("/logout")
async def logout(request: Request):
    request.session.pop("user", None)
    redirect = request.query_params.get("redirect")
    if redirect:
        return RedirectResponse(url=f"{redirect}", status_code=302)
    return {"success": True}


@router.get("/callback")
async def callback(request: Request, auth_client: BaseAuthClient = Depends(get_auth_client)):
    user_info = await auth_client.get_user_info(request)
    if user_info:
        request.session["user"] = dict(user_info)
        supabase = get_client()
        supabase.table("profiles").upsert(user_info).execute()
    return RedirectResponse(url=f"{WEB_LOGIN_SUCCESS_URL}", status_code=302)


@router.get("/userinfo")
async def userinfo(request: Request, auth_client: BaseAuthClient = Depends(get_auth_client)):
    user = request.session.get("user")
    if not user:
        data = await auth_client.anonymouseLogin(request)
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
async def get_user_repos(user_id: Optional[str] = Depends(get_user_id), auth_client: BaseAuthClient = Depends(get_auth_client)):
    if not user_id:
        raise HTTPException(status_code=401, detail="User not found")
    try:
        access_token = await auth_client.get_access_token(user_id=user_id)
        g = Github(access_token)
        user = g.get_user()
        repos = user.get_repos()

        repo_names = [
            {"name": repo.full_name} for repo in repos if repo.permissions.maintain
        ]
        return {"data": repo_names, "status": 200}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
