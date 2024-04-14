from fastapi import APIRouter, BackgroundTasks, Header, Request
import logging
import requests
import time
from dao.authorization import AuthorizationDAO
import boto3
from botocore.exceptions import ClientError
from jwt import JWT, jwk_from_pem
from models.authorization import Authorization

from uilts.env import get_env_variable

APP_ID = get_env_variable("GITHUB_APP_ID")
CLIENT_ID = get_env_variable("GITHUB_APP_CLIENT_ID")
CLIENT_SECRET = get_env_variable("GITHUB_APP_CLIENT_SECRET")


logger = logging.getLogger(__name__)
router = APIRouter(
    prefix="/api/github",
    tags=["health_checkers"],
    responses={404: {"description": "Not found"}},
)

def get_pem():
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

def get_jwt():
    payload = {
        # Issued at time
        'iat': int(time.time()),
        # JWT expiration time (10 minutes maximum)
        'exp': int(time.time()) + 600,
        # GitHub App's identifier
        'iss': APP_ID
    }
    
    pem = get_pem()
    signing_key = jwk_from_pem(pem.encode("utf-8"))

    print(pem)
    jwt_instance = JWT()
    return jwt_instance.encode(payload, signing_key, alg='RS256')
    
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

# https://github.com/login/oauth/authorize?client_id=Iv1.c2e88b429e541264
@router.get("/app/installation/callback")
def github_app_callback(code: str, installation_id: str, setup_action: str):
    authorizationDAO = AuthorizationDAO()

    if setup_action != "install":
        return { "success": False, "message": f"Invalid setup_action value {setup_action}" }
    elif authorizationDAO.exists(installation_id=installation_id):
        return { "success": False, "message": f"Installation_id {installation_id} Exists" }
    else:
        jwt = get_jwt()
        access_token = get_app_installations_access_token(installation_id=installation_id, jwt=jwt)
        authorization = Authorization(
            **access_token,
            code=code,
            installation_id=installation_id,
            created_at=int(time.time())
        )

        success, message = authorizationDAO.create(authorization)

        return { "success": success, "message": message }

@router.post("/app/webhook")
def github_app_webhook(request: Request, background_tasks: BackgroundTasks, x_github_event: str = Header(...)):
    logger.info("github_app_webhook: x_github_event=%s, %s", x_github_event, request.json())
    return {"hello": "world"}
