from pydantic import BaseModel


class DalleData(BaseModel):
    text: str


class Message(BaseModel):
    role: str
    content: str


class ChatData(BaseModel):
    messages: list[Message] = []
    prompt: str = None

class DataItem(BaseModel):
    input_data: str
