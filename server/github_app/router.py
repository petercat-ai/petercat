from typing import Annotated
from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
    Header,
    Request,
    status,
)
import logging
from fastapi.responses import RedirectResponse

import time
from github import Auth, Github
from auth.get_user_info import get_user
from core.dao.authorizationDAO import AuthorizationDAO
from core.dao.repositoryConfigDAO import RepositoryConfigDAO
from core.models.repository import RepositoryConfig
from core.models.authorization import Authorization
from core.models.user import User

from github_app.handlers import get_handler
from github_app.purchased import PurchaseServer
from github_app.utils import (
    get_app_installations_access_token,
    get_installation_repositories,
    get_jwt,
    get_private_key,
)

from petercat_utils import get_env_variable

REGIN_NAME = get_env_variable("AWS_REGION")
AWS_GITHUB_SECRET_NAME = get_env_variable("AWS_GITHUB_SECRET_NAME")
APP_ID = get_env_variable("X_GITHUB_APP_ID")
WEB_URL = get_env_variable("WEB_URL")

logger = logging.getLogger()
logger.setLevel("INFO")

router = APIRouter(
    prefix="/api/github",
    tags=["github"],
    responses={404: {"description": "Not found"}},
)

@router.get("/marketplace/purchase")
def marketplace_purchase(marketplace_listing_plan_id: str):
    return { "success": True } 

# https://github.com/login/oauth/authorize?client_id=Iv1.c2e88b429e541264
@router.get("/app/installation/callback")
def github_app_callback(code: str, installation_id: str, setup_action: str):
    authorization_dao = AuthorizationDAO()
    repository_config_dao = RepositoryConfigDAO()
    if setup_action != "install":
        return {
            "success": False,
            "message": f"Invalid setup_action value {setup_action}",
        }
    elif authorization_dao.exists(installation_id=installation_id):
        return {
            "success": False,
            "message": f"Installation_id {installation_id} Exists",
        }
    else:
        jwt = get_jwt()
        access_token = get_app_installations_access_token(
            installation_id=installation_id, jwt=jwt
        )
        print(f"get_app_installations_access_token: {access_token}")
        authorization = Authorization(
            **access_token,
            code=code,
            installation_id=installation_id,
            created_at=int(time.time()),
        )

        success, message = authorization_dao.create(authorization)
        print(f"github_app_callback: success={success}, message={message}")

        installed_repositories = get_installation_repositories(
            access_token=access_token["token"]
        )
        for repo in installed_repositories["repositories"]:
            repository_config = RepositoryConfig(
                repo_name=repo["full_name"], robot_id="", created_at=int(time.time())
            )
            repository_config_dao.create(repository_config)

        return RedirectResponse(
            url=f"{WEB_URL}/github/installed?message={message}", status_code=302
        )


@router.post("/app/webhook")
async def github_app_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    x_github_event: str = Header(...),
):
    payload = await request.json()
    if x_github_event == "marketplace_purchase":
        return PurchaseServer().purchased(payload)

    if "installation" not in payload:
        return {"success": False, "message": "Invalid Webhook request"}

    installation_id = payload["installation"]["id"]
    try:

        auth = Auth.AppAuth(
            app_id=APP_ID,
            private_key=get_private_key(
                region_name=REGIN_NAME, secret_id=AWS_GITHUB_SECRET_NAME
            ),
            jwt_algorithm="RS256",
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
async def get_user_organizations(
    user: Annotated[User | None, Depends(get_user)] = None
):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Github Login needed"
        )
    auth = Auth.Token(token=user.access_token)
    g = Github(auth=auth)
    user = g.get_user()
    orgs = user.get_orgs()

    return [org.raw_data for org in orgs]
