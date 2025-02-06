from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

router = APIRouter(
    prefix="/api/figma",
    tags=["convert_monster"],
    responses={404: {"description": "Not found"}},
)


# 请求模型
class RequestData(BaseModel):
    apiKey: str
    input: str


# 响应模型
class ResponseData(BaseModel):
    completion: str


# 错误响应模型
class ErrorResponse(BaseModel):
    error: str


# 处理 DeepSeek API 请求
async def call_deepseek_api(api_key: str, input_data: str) -> dict:
    url = "https://api.deepseek.com/v1/query"
    headers = {"x-api-key": api_key, "Content-Type": "application/json"}
    body = {"input": input_data, "max_tokens": 1024, "temperature": 0.7}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=body, headers=headers)
            response.raise_for_status()  # 抛出非200响应的错误
            return response.json()
        except httpx.HTTPError as e:
            raise HTTPException(
                status_code=response.status_code if response else 500,
                detail=f"API error: {str(e)}",
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.post(
    "/convert",
    response_model=ResponseData,
    responses={
        200: {"description": "Successful conversion"},
        400: {"model": ErrorResponse, "description": "Bad request"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def convert_endpoint(request_data: RequestData) -> ResponseData:
    try:
        # 验证请求数据
        if not request_data.apiKey or not request_data.input:
            raise HTTPException(
                status_code=400, detail="Missing apiKey or input in the request"
            )

        print(f"Received request: {request_data}")

        # 调用 DeepSeek API
        response = await call_deepseek_api(request_data.apiKey, request_data.input)

        # 适配响应
        return ResponseData(
            completion=response.get(
                "result", ""
            )  # 假设 DeepSeek 返回的数据包含 `result`
        )

    except HTTPException:
        raise  # 重新抛出 HTTP 异常
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
