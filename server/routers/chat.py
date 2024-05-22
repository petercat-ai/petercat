import json
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from data_class import ChatData
from agent import qa_chat, bot_builder
from verify.rate_limit import verify_rate_limit


router = APIRouter(
    prefix="/api/chat",
    tags=["chat"],
    responses={404: {"description": "Not found"}},
)

@router.post("/qa", response_class=StreamingResponse, dependencies=[Depends(verify_rate_limit)])
def run_qa_chat(input_data: ChatData):
    result = qa_chat.agent_stream_chat(input_data)
    return StreamingResponse(result, media_type="text/event-stream")

@router.post("/issue_helper", dependencies=[Depends(verify_rate_limit)])
async def run_issue_helper(input_data: ChatData):
    result = await qa_chat.agent_chat(input_data)
    return result


@router.post("/builder", response_class=StreamingResponse, dependencies=[Depends(verify_rate_limit)])
def run_bot_builder(input_data: ChatData):
    result = bot_builder.agent_stream_chat(input_data)
    return StreamingResponse(result, media_type="text/event-stream")

