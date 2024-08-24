from typing import Union

from petercat_utils import get_env_variable
from github import Auth

from event_handler.pull_request import PullRequestEventHandler
from event_handler.discussion import DiscussionEventHandler
from event_handler.issue import IssueEventHandler

APP_ID = get_env_variable("X_GITHUB_APP_ID")


def get_handler(event: str, payload: dict, auth: Auth.AppAuth, installation_id: int) -> Union[PullRequestEventHandler, IssueEventHandler, DiscussionEventHandler, None]:
    handlers = {
        'pull_request': PullRequestEventHandler,
        'issues': IssueEventHandler,
        'discussion': DiscussionEventHandler
    }
    return handlers.get(event)(payload=payload, auth=auth, installation_id=installation_id) if event in handlers else None
