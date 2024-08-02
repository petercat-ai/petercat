from fastapi import APIRouter, BackgroundTasks, Header, Request
import logging
from github import Auth
from utils.github import get_handler, get_private_key
from petercat_utils import get_env_variable

APP_ID = get_env_variable("X_GITHUB_APP_ID")

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
    return {"success": True}


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
