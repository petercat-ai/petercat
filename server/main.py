import os
import uvicorn

from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from agent import stream
from uilts.env import get_env_variable
from data_class import ChatData, ExecuteMessage
from message_queue.queue_wrapper import delete_messages, get_queue, receive_messages, send_message, unpack_message

open_api_key = get_env_variable("OPENAI_API_KEY")
sqs_queue_name = get_env_variable("PETERCAT_EX_SQS")

app = FastAPI( 
    title="Bo-meta Server",
    version="1.0",
    description="Agent Chat APIs"
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/api/message")
def send_sqs_message(message: ExecuteMessage):
    queue = get_queue(sqs_queue_name)
    return send_message(queue=queue, message=message)

@app.get("/api/message/receive")
def receive_sqs_message():
    queue = get_queue(sqs_queue_name)
    return StreamingResponse(receive_messages(queue), media_type="text/event-stream")


@app.post("/api/chat/stream", response_class=StreamingResponse)
def run_agent_chat(input_data: ChatData):
    result = stream.agent_chat(input_data, open_api_key)
    return StreamingResponse(result, media_type="text/event-stream")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))
