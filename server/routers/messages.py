from fastapi import APIRouter, Depends, HTTPException

from data_class import ExecuteMessage
from message_queue.queue_wrapper import get_queue, receive_messages, send_message
from fastapi.responses import StreamingResponse

from uilts.env import get_env_variable

sqs_queue_name = get_env_variable("PETERCAT_EX_SQS")


router = APIRouter(
    prefix="/api",
    tags=["message"],
    responses={404: {"description": "Not found"}},
)

@router.post("/message")
def send_sqs_message(message: ExecuteMessage):
    queue = get_queue(sqs_queue_name)
    return send_message(queue=queue, message=message)

@router.get("/message/receive")
def receive_sqs_message():
    queue = get_queue(sqs_queue_name)
    return StreamingResponse(receive_messages(queue), media_type="text/event-stream")
