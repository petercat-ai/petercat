from typing import Union

from event_handler.intsall import InstallationEventHandler, InstallationEditEventHandler
from utils.env import get_env_variable
from github import Auth

from event_handler.pull_request import (
    PullRequestEventHandler,
    PullRequestReviewCommentEventHandler,
)
from event_handler.discussion import (
    DiscussionEventHandler,
    DiscussionCommentEventHandler,
)
from event_handler.issue import IssueEventHandler, IssueCommentEventHandler

APP_ID = get_env_variable("X_GITHUB_APP_ID")


def get_handler(
    event: str, payload: dict, auth: Auth.AppAuth, installation_id: int
) -> Union[
    PullRequestEventHandler,
    IssueCommentEventHandler,
    IssueEventHandler,
    DiscussionEventHandler,
    DiscussionCommentEventHandler,
    PullRequestReviewCommentEventHandler,
    InstallationEventHandler,
    InstallationEditEventHandler,
    None,
]:
    handlers = {
        "pull_request": PullRequestEventHandler,
        "issues": IssueEventHandler,
        "issue_comment": IssueCommentEventHandler,
        "discussion": DiscussionEventHandler,
        "discussion_comment": DiscussionCommentEventHandler,
        "pull_request_review_comment": PullRequestReviewCommentEventHandler,
        "pull_request_review": PullRequestReviewCommentEventHandler,
        "installation": InstallationEventHandler,
        "installation_repositories": InstallationEditEventHandler,
    }
    return (
        handlers.get(event)(payload=payload, auth=auth, installation_id=installation_id)
        if event in handlers
        else None
    )
