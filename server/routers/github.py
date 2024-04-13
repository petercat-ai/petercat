from fastapi import APIRouter, Depends, HTTPException
import logging

from uilts.env import get_env_variable

CLIENT_ID = get_env_variable("GITHUB_APP_CLIENT_ID")
CLIENT_SECRET = get_env_variable("GITHUB_APP_CLIENT_SECRET")


logger = logging.getLogger(__name__)
router = APIRouter(
    prefix="/api/github",
    tags=["health_checkers"],
    responses={404: {"description": "Not found"}},
)

    
@router.get("/app/callback")
def github_app_callback(callbackParams):
    logger.info("Github App Callback: %s", callbackParams)
    return {"Hello": "World"}

@router.post("/app/webhook")
def github_app_webhook(callbackParams):
    logger.info("Github App Webhook: %s", callbackParams)
    return {"hello": "world"}
