from fastapi import WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from fastapi import APIRouter
import httpx
import json

router = APIRouter(
    prefix="/api",
    tags=["convertmonster"],
    responses={404: {"description": "Not found"}},
)

class RequestData(BaseModel):
    apiKey: str
    input: str

# 处理 DeepSeek API 请求
async def call_deepseek_api(api_key: str, input_data: str):
    url = "https://api.deepseek.com/v1/query"
    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json"
    }
    body = {
        "input": input_data,
        "max_tokens": 1024,
        "temperature": 0.7
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=body, headers=headers)
        if response.status_code != 200:
            raise Exception(f"API error: {response.status_code} - {response.text}")
        return response.json()

# WebSocket 路由
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            try:
                # 解析消息
                request_data = json.loads(data)
                if not request_data.get("apiKey") or not request_data.get("input"):
                    raise ValueError("Missing apiKey or input in the message")
                
                print(f"Received request: {request_data}")

                # 调用 DeepSeek API
                response = await call_deepseek_api(request_data['apiKey'], request_data['input'])

                # 适配并发送响应
                adapted_response = {
                    "completion": response.get("result")  # 假设 DeepSeek 返回的数据包含 `result`
                }

                await websocket.send_json(adapted_response)
            
            except Exception as e:
                await websocket.send_json({"error": str(e)})
    except WebSocketDisconnect:
        print("Client disconnected")
