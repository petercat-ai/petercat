from typing import Awaitable, Callable
from fastapi import HTTPException, Request, status
from petercat_utils import get_env_variable
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

ENV = get_env_variable("PETERCAT_ENV")

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
    # 只有 preview production 和 unitest 进行鉴权
    if ENV not in ['preview', 'production', 'unitest']:
      return await call_next(request)
    
    # Auth 相关的直接放过
    if request.url.path.startswith("/api/auth"):
      return await call_next(request)
  
    if request.url.path in ALLOW_LIST:
      return await call_next(request)
  
    # 获取 session 中的用户信息
    user = request.session.get("user") 

    if not user:
      # 如果没有用户信息，返回 401 Unauthorized 错误
      raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    # 如果是匿名用户，仅放过固定
    if user['sub'].startswith("client|"):
      if request.url.path in ANONYMOUS_USER_ALLOW_LIST:
        return await call_next(request)
      else:
        # 如果没有用户信息，返回 401 Unauthorized 错误
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Anonymous User Not Allow")
    return await call_next(request)
