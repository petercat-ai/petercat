import os

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.utilities.dalle_image_generator import DallEAPIWrapper
from dotenv import load_dotenv

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


class InputData(BaseModel):
    desc: str = None

@app.post("/api/dall-e")
def img_generator(input_data: InputData):
    os.environ["OPENAI_API_KEY"] = open_api_key
    llm = OpenAI(temperature=0.8)
    prompt = PromptTemplate(
        input_variables=["image_desc"],
        template="Generate a detailed prompt to generate an image based on the following description: {image_desc}",
    )
    chain = LLMChain(llm=llm, prompt=prompt)
    image_url = DallEAPIWrapper().run(chain.run(input_data))
    return image_url
