from fastapi import APIRouter, Depends, HTTPException
import logging
import requests
from pydantic import BaseModel


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
def github_app_callback(code: str):
    print("Github App Callback", code)
    logger.info("Github App Callback: %s", code)
    resp = requests.post('https://github.com/login/oauth/access_token',
        json={
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "code": code,
        }
    )

    return resp.json()

@router.post("/app/webhook")
def github_app_webhook(callbackParams):
    logger.info("Github App Webhook: %s", callbackParams)
    return {"hello": "world"}
