import jwt
import requests

import time

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend

from petercat_utils.utils.env import get_env_variable
from utils.get_private_key import get_private_key

APP_ID = get_env_variable("X_GITHUB_APP_ID")
AWS_GITHUB_SECRET_NAME = get_env_variable("AWS_GITHUB_SECRET_NAME")
REGIN_NAME = get_env_variable("AWS_REGION")


def get_jwt():
    payload = {
        # Issued at time
        "iat": int(time.time()),
        # JWT expiration time (10 minutes maximum)
        "exp": int(time.time()) + 600,
        # GitHub App's identifier
        "iss": APP_ID,
    }

    pem = get_private_key(region_name=REGIN_NAME, secret_id=AWS_GITHUB_SECRET_NAME)
    private_key = serialization.load_pem_private_key(
        pem.encode("utf-8"), password=None, backend=default_backend()
    )
    return jwt.encode(payload, private_key, algorithm="RS256")


def get_app_installations_access_token(installation_id: str, jwt: str):
    url = f"https://api.github.com/app/installations/{installation_id}/access_tokens"
    print("get_app_installations_access_token", url, jwt)
    resp = requests.post(
        url,
        headers={
            "X-GitHub-Api-Version": "2022-11-28",
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {jwt}",
        },
    )

    return resp.json()


def get_installation_repositories(access_token: str):
    url = "https://api.github.com/installation/repositories"
    print("get_installation_repositories", url)
    resp = requests.get(
        url,
        headers={
            "X-GitHub-Api-Version": "2022-11-28",
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {access_token}",
        },
    )
    return resp.json()
