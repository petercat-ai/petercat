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
from core.models.bot import RepoBindBotRequest
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


# https://github.com/login/oauth/authorize?client_id=Iv1.c2e88b429e541264
@router.get("/app/installation/callback")
def github_app_callback(code: str, installation_id: str, setup_action: str):
    authorization_dao = AuthorizationDAO()
    repository_config_dao = RepositoryConfigDAO()
    if setup_action == "install":
        if authorization_dao.exists(installation_id=installation_id):
            message = (f"Installation_id {installation_id} Exists",)
            return RedirectResponse(
                url=f"{WEB_URL}/github/installed/{message}", status_code=302
            )
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
            installed_repositories = get_installation_repositories(
                access_token=access_token["token"]
            )
            for repo in installed_repositories["repositories"]:
                repository_config = RepositoryConfig(
                    owner_id=str(repo["owner"]["id"]),
                    repo_name=repo["full_name"],
                    repo_id=str(repo["id"]),
                    robot_id="",
                    created_at=int(time.time()),
                )
                repository_config_dao.create(repository_config)

            return RedirectResponse(
                url=f"{WEB_URL}/github/installed?message={message}", status_code=302
            )
    # ignore others setup_action,such as deleted our app
    return {
        "success": False,
        "message": f"Invalid setup_action value {setup_action},please delete the app first then re-install the app.",
    }


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


@router.get("/user/repos_installed_app")
def get_user_repos_installed_app_(
    user: Annotated[User | None, Depends(get_user)] = None
):
    """
    Get github user installed app repositories which saved in platform database.
    A repo can only be bound to a single bot.
    """
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Github Login needed"
        )
    try:
        auth = Auth.Token(token=user.access_token)
        g = Github(auth=auth)
        github_user = g.get_user()
        orgs = github_user.get_orgs()
        repository_config_dao = RepositoryConfigDAO()
        installations = repository_config_dao.query_by_owners(
            [org.id for org in orgs] + [github_user.id]
        )
        return {"data": installations, "status": 200}
    except Exception as e:
        print("Error: ", e)
        return {
            "success": False,
            "message": "Get user which installed app repos failed",
        }


@router.post("/repo/bind_bot", status_code=200)
def bind_bot_to_repo(
    request: RepoBindBotRequest,
    user: Annotated[User | None, Depends(get_user)] = None,
):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Github Login needed"
        )
    try:
        repository_config_dao = RepositoryConfigDAO()
        repository_config_dao.update_bot_to_repos(request.repos)
        return {"success": True, "message": "Bind bot to repos success"}
    except Exception as e:
        print("Error: ", e)
        return {
            "success": False,
            "message": "Bind bot to repos Failed",
        }
