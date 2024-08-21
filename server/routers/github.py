from typing import Annotated
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Header, Request, status
import logging
from fastapi.responses import RedirectResponse
import requests
import time
from github import Auth, Github
from auth.get_user_info import get_user_access_token
from dao.authorizationDAO import AuthorizationDAO
from dao.repositoryConfigDAO import RepositoryConfigDAO
from models.repository import RepositoryConfig
from models.authorization import Authorization
from utils.github import get_handler, get_private_key
from petercat_utils import get_env_variable

import jwt
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend

APP_ID = get_env_variable("X_GITHUB_APP_ID")
WEB_URL =  get_env_variable("WEB_URL")

logger = logging.getLogger()
logger.setLevel("INFO")

router = APIRouter(
    prefix="/api/github",
    tags=["github"],
    responses={404: {"description": "Not found"}},
)

def get_jwt():
    payload = {
        # Issued at time
        'iat': int(time.time()),
        # JWT expiration time (10 minutes maximum)
        'exp': int(time.time()) + 600,
        # GitHub App's identifier
        'iss': APP_ID
    }

    pem = get_private_key()
    private_key = serialization.load_pem_private_key(
        pem.encode("utf-8"), password=None, backend=default_backend()
    )
    return jwt.encode(payload, private_key, algorithm='RS256')

def get_app_installations_access_token(installation_id: str, jwt: str):
    url = f"https://api.github.com/app/installations/{installation_id}/access_tokens"
    print("get_app_installations_access_token", url, jwt)
    resp = requests.post(url,
        headers={
            'X-GitHub-Api-Version': '2022-11-28',
            'Accept': 'application/vnd.github+json',
            'Authorization': f"Bearer {jwt}"
        }
    )

    return resp.json()

def get_installation_repositories(access_token: str):
    url = f"https://api.github.com/installation/repositories"
    print("get_installation_repositories", url)
    resp = requests.get(url, headers={
        'X-GitHub-Api-Version': '2022-11-28',
        'Accept': 'application/vnd.github+json',
        'Authorization': f"Bearer {access_token}"
    })
    return resp.json()
    

# https://github.com/login/oauth/authorize?client_id=Iv1.c2e88b429e541264
@router.get("/app/installation/callback")
def github_app_callback(code: str, installation_id: str, setup_action: str):
    authorization_dao = AuthorizationDAO()
    repository_config_dao = RepositoryConfigDAO()
    if setup_action != "install":
        return { "success": False, "message": f"Invalid setup_action value {setup_action}" }
    elif authorization_dao.exists(installation_id=installation_id):
        return { "success": False, "message": f"Installation_id {installation_id} Exists" }
    else:
        jwt = get_jwt()
        access_token = get_app_installations_access_token(installation_id=installation_id, jwt=jwt)
        print(f"get_app_installations_access_token: {access_token}")
        authorization = Authorization(
            **access_token,
            code=code,
            installation_id=installation_id,
            created_at=int(time.time())
        )

        success, message = authorization_dao.create(authorization)
        print(f"github_app_callback: success={success}, message={message}")

        installed_repositories = get_installation_repositories(access_token=access_token['token'])
        for repo in installed_repositories["repositories"]:
            repository_config = RepositoryConfig(repo_name=repo["full_name"], robot_id="", created_at=int(time.time()))
            repository_config_dao.create(repository_config)

        return RedirectResponse(url=f'{WEB_URL}/github/installed?message={message}', status_code=302)

@router.post("/app/webhook")
async def github_app_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    x_github_event: str = Header(...),
):
    payload = await request.json()
    if "installation" not in payload:
        return {"success": False, "message": "Invalid Webhook request"}

    installation_id = payload["installation"]["id"]
    try:
        auth = Auth.AppAuth(
            app_id=APP_ID, private_key=get_private_key(), jwt_algorithm="RS256"
        ).get_installation_auth(installation_id=int(installation_id))
    except Exception as e:
        print("Failed", f"Authentication failed: {e}")
        return {"success": False, "message": f"Authentication failed: {e}"}

    handler = get_handler(
        x_github_event, payload, auth, installation_id=installation_id
    )
    if handler:
        await handler.execute()
        return {"success": True}
    else:
        print("Failed, Unsupported GitHub event")
        return {"success": False, "message": "Unsupported GitHub event"}

@router.get("/user/organizations")
async def get_user_organizations(user_access_token: Annotated[str | None, Depends(get_user_access_token)] = None):
    if user_access_token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Github Login needed")
    auth = Auth.Token(token=user_access_token)
    g = Github(auth=auth)
    user = g.get_user()
    orgs = user.get_orgs()
    
    return [org.raw_data for org in orgs]

@router.get("/orgs/{org_id}/repos")
async def get_org_repos(org_id: str, user_access_token: Annotated[str | None, Depends(get_user_access_token)] = None):
    if user_access_token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Github Login needed")
    auth = Auth.Token(token=user_access_token)
    g = Github(auth=auth)
    org = g.get_organization(org_id)
    repos = org.get_repos()
    print(f"repos={repos}")
    return [repo.raw_data for repo in repos]
