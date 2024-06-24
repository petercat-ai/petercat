
from typing import Union
import boto3
from botocore.exceptions import ClientError
from event_handler.pull_request import PullRequestEventHandler
from event_handler.discussion import DiscussionEventHandler
from event_handler.issue import IssueEventHandler
from uilts.env import get_env_variable
from github import Auth


APP_ID = get_env_variable("X_GITHUB_APP_ID")

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

def get_handler(event: str, payload: dict, auth: Auth.AppAuth, installation_id: int) -> Union[PullRequestEventHandler, IssueEventHandler, DiscussionEventHandler, None]:
    handlers = {
        'pull_request': PullRequestEventHandler,
        'issues': IssueEventHandler,
        'discussion': DiscussionEventHandler
    }
    return handlers.get(event)(payload=payload, auth=auth, installation_id=installation_id) if event in handlers else None
