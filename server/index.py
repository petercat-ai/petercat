import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from langchain_api import chat
from openai_api import dalle
from data_class import DalleData, ChatData

load_dotenv(verbose=True, override=True)

open_api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# 设置CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/dall-e")
def run_img_generator(input_data: DalleData):
    result = dalle.img_generator(input_data, open_api_key)
    return result


@app.post("/api/chat")
def run_langchain_chat(input_data: ChatData):
    result = chat.langchain_chat(input_data, open_api_key)
    return result
