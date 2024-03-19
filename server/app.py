import os
from fastapi import FastAPI
from mangum import Mangum

from data_class import DalleData, ChatData
from openai_api import dalle
from langchain_api import chat

open_api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()
handler = Mangum(app)

@app.get("/api/greetings")
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

if __name__ == "__main__":
    # run main.py to debug backend
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=80)
