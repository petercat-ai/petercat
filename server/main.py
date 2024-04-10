from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from data_class import DalleData, ChatData
from openai_api import dalle
from langchain_api import chat
from agent import stream
from uilts.env import get_env_variable
import uvicorn

open_api_key = get_env_variable("OPENAI_API_KEY")

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

@app.post("/api/dall-e")
def run_img_generator(input_data: DalleData):
    result = dalle.img_generator(input_data, open_api_key)
    return result

@app.post("/api/chat")
def run_langchain_chat(input_data: ChatData):
    result = chat.langchain_chat(input_data, open_api_key)
    return result


@app.post("/api/chat/stream", response_class=StreamingResponse)
def run_agent_chat(input_data: ChatData):
    result = stream.agent_chat(input_data, open_api_key)
    return StreamingResponse(result, media_type="text/event-stream")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))
