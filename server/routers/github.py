from fastapi import APIRouter, BackgroundTasks, Header, Request
import logging
import boto3
from botocore.exceptions import ClientError
# from jwt import JWT, jwk_from_pem
from event_handler.pull_request import PullRequestEventHandler
from event_handler.issue import IssueEventHandler
from github import Auth

from uilts.env import get_env_variable

APP_ID = get_env_variable("X_GITHUB_APP_ID")
CLIENT_ID = get_env_variable("X_GITHUB_APPS_CLIENT_ID")
CLIENT_SECRET = get_env_variable("X_GITHUB_APPS_CLIENT_SECRET")


logger = logging.getLogger()
logger.setLevel("INFO")

router = APIRouter(
    prefix="/api/github",
    tags=["github"],
    responses={404: {"description": "Not found"}},
)

def get_private_key():
    secret_name = "prod/githubapp/petercat/pem"
    region_name = "ap-northeast-1"
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )
    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        # For a list of exceptions thrown, see
        # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        raise e

    return get_secret_value_response['SecretString']

# https://github.com/login/oauth/authorize?client_id=Iv1.c2e88b429e541264
@router.get("/app/installation/callback")
def github_app_callback(code: str, installation_id: str, setup_action: str):
    return { "success": True }

@router.post("/app/webhook")
async def github_app_webhook(request: Request, background_tasks: BackgroundTasks, x_github_event: str = Header(...)):
    payload = await request.json()

    if "installation" in payload:
        installation_id = payload["installation"]["id"]
        auth = Auth.AppAuth(app_id=APP_ID, private_key=get_private_key(), jwt_algorithm="RS256").get_installation_auth(installation_id=int(installation_id))
        print(f"pull_request: {x_github_event}")
        match x_github_event:
            case 'pull_request':
                handler = PullRequestEventHandler(payload=payload, auth=auth)
                handler.execute()
            case 'issues':
                handler = IssueEventHandler(payload=payload, auth=auth)
                handler.execute()
            case _:
                return { "success": True }
    else:
        return { "success": False, "message": "Invalid Webhook request"}

