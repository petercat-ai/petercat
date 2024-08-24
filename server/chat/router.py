from typing import Annotated, Optional
from github import Auth
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from petercat_utils.data_class import ChatData

from agent import qa_chat, bot_builder
from auth.rate_limit import verify_rate_limit
from auth.get_user_info import get_user_access_token, get_user_id


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
    user_access_token: Annotated[str | None, Depends(get_user_access_token)] = None,
):
    print(
        f"run_qa_chat: input_data={input_data}, user_access_token={user_access_token}"
    )

    token = Auth.Token(user_access_token) if user_access_token is not None else None
    result = qa_chat.agent_stream_chat(
        input_data=input_data, token=token
    )
    return StreamingResponse(result, media_type="text/event-stream")


@router.post("/qa", dependencies=[Depends(verify_rate_limit)])
async def run_issue_helper(
    input_data: ChatData,
    user_access_token: Annotated[str | None, Depends(get_user_access_token)] = None,
):
    token = Auth.Token(user_access_token) if user_access_token is not None else None
    result = await qa_chat.agent_chat(input_data, token)
    return result


@router.post(
    "/stream_builder",
    response_class=StreamingResponse,
    dependencies=[Depends(verify_rate_limit)],
)
def run_bot_builder(
    input_data: ChatData,
    bot_id: Optional[str] = None,
    user_id: Annotated[str | None, Depends(get_user_id)] = None,
):
    if not user_id:
        return StreamingResponse(
            generate_auth_failed_stream(), media_type="text/event-stream"
        )
    result = bot_builder.agent_stream_chat(input_data, user_id, bot_id)
    return StreamingResponse(result, media_type="text/event-stream")
