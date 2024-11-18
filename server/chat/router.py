from typing import Annotated, Optional
from github import Auth
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from agent.base import dict_to_sse
from agent.bot import Bot, bot_builder
from agent.bot.get_bot import get_bot
from core.models.user import User
from core.service.user_token_usage import create_token_recorder
from petercat_utils.data_class import ChatData
from toolz import compose

from agent import qa_chat
from auth.rate_limit import verify_rate_limit
from auth.get_user_info import get_user, get_user_id

router = APIRouter(
    prefix="/api/chat",
    tags=["chat"],
    responses={404: {"description": "Not found"}},
)


async def generate_auth_failed_stream():
    message = "Auth failed, please login first\n\n"
    yield message


@router.post(
    "/stream_qa",
    response_class=StreamingResponse,
    dependencies=[Depends(verify_rate_limit)],
)
def run_qa_chat(
    input_data: ChatData,
    user: Annotated[User | None, Depends(get_user)] = None,
    bot: Annotated[Bot | None, Depends(get_bot)] = None,
):
    print(f"run_qa_chat: input_data={input_data}, bot={bot}, llm={bot.llm}")

    auth_token = (
        Auth.Token(user.access_token) if getattr(user, "access_token", None) else None
    )
    token_usage_recorder = create_token_recorder(user=user, bot=bot)

    pipeline = compose(
        dict_to_sse,
        token_usage_recorder,
        qa_chat.agent_stream_chat,
    )

    result = pipeline(input_data=input_data, auth_token=auth_token, bot=bot)

    return StreamingResponse(result, media_type="text/event-stream")


@router.post("/qa", dependencies=[Depends(verify_rate_limit)])
async def run_issue_helper(
    input_data: ChatData,
    user: Annotated[User | None, Depends(get_user)] = None,
    bot: Annotated[Bot | None, Depends(get_bot)] = None,
):
    auth_token = (
        Auth.Token(user.access_token) if getattr(user, "access_token", None) else None
    )
    result = await qa_chat.agent_chat(
        input_data,
        auth_token,
        bot,
    )
    return result


@router.post(
    "/stream_builder",
    response_class=StreamingResponse,
    dependencies=[Depends(verify_rate_limit)],
)
def run_bot_builder(
    input_data: ChatData,
    user_id: Annotated[str | None, Depends(get_user_id)] = None,
):
    if not user_id:
        return StreamingResponse(
            generate_auth_failed_stream(), media_type="text/event-stream"
        )
    bot_id = input_data.bot_id
    result = bot_builder.agent_stream_chat(input_data, user_id, bot_id)
    return StreamingResponse(result, media_type="text/event-stream")
