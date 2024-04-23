import os

import uvicorn
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from agent import stream

from uilts.env import get_env_variable
from data_class import ChatData

# Import fastapi routers
from routers import bot, health_checker, github, rag, auth

open_api_key = get_env_variable("OPENAI_API_KEY")
is_dev = bool(get_env_variable("IS_DEV"))
session_secret_key = get_env_variable("FASTAPI_SECRET_KEY")
app = FastAPI( 
    title="Bo-meta Server",
    version="1.0",
    description="Agent Chat APIs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 明确指定允许的源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法
    allow_headers=["*"],  # 允许所有头部
)
app.add_middleware(
    SessionMiddleware,
    secret_key = session_secret_key,
)

app.include_router(health_checker.router)
app.include_router(github.router)
app.include_router(rag.router)
app.include_router(bot.router)
app.include_router(auth.router)

@app.post("/api/chat/stream", response_class=StreamingResponse)
def run_agent_chat(input_data: ChatData):
    result = stream.agent_chat(input_data, open_api_key)
    return StreamingResponse(result, media_type="text/event-stream")

if __name__ == "__main__":
    if is_dev:
        uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", "8080")), reload=True)
    else:
        uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))
