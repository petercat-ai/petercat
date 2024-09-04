from typing import Awaitable, Callable
from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

ALLOW_LIST = [
  "/favicon.ico",
  "/api/health_checker",
  "/api/bot/list",
  "/api/bot/detail",
  "/api/github/app/webhook",
  "/app/installation/callback",
]

ANONYMOUS_USER_ALLOW_LIST = [
  "/api/chat/qa",
  "/api/chat/stream_qa",
]

class AuthMiddleWare(BaseHTTPMiddleware):
  async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
    try:
      # Auth 相关的直接放过
      if request.url.path.startswith("/api/auth"):
        return await call_next(request)
      
      if request.url.path in ALLOW_LIST:
        return await call_next(request)
      
      # 获取 session 中的用户信息
      user = request.session.get("user") 
      if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
      
      if user['sub'].startswith("client|"):
        if request.url.path in ANONYMOUS_USER_ALLOW_LIST:
          return await call_next(request)
        else:
          # 如果没有用户信息，返回 401 Unauthorized 错误
          raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Anonymous User Not Allow")
    
      return await call_next(request)
    except HTTPException as e:
        # 处理 HTTP 异常
        return JSONResponse(status_code=e.status_code, content={"detail": e.detail})
    except Exception as e:
        # 处理其他异常
        return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})
