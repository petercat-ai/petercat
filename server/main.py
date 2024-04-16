import os
from rag import retrieval
import uvicorn
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from agent import stream

from uilts.env import get_env_variable
from data_class import ChatData

# Import fastapi routers
from routers import bot, health_checker, github

open_api_key = get_env_variable("OPENAI_API_KEY")
is_dev = bool(get_env_variable("IS_DEV"))

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

app.include_router(health_checker.router)
app.include_router(github.router)
app.include_router(bot.router)


@app.post("/api/chat/stream", response_class=StreamingResponse)
def run_agent_chat(input_data: ChatData):
    result = stream.agent_chat(input_data, open_api_key)
    return StreamingResponse(result, media_type="text/event-stream")

@app.post("/api/rag/add_knowledge")
def add_knowledge():
    data=retrieval.add_knowledge()
    return data

@app.post("/api/rag/search_knowledge")
def search_knowledge(query: str):
    data=retrieval.search_knowledge(query)
    return data

if __name__ == "__main__":
    if is_dev:
        uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", "8080")), reload=True)
    else:
        uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))