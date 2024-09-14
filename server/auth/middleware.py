from typing import Awaitable, Callable
from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse, PlainTextResponse
from petercat_utils import get_env_variable
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from fastapi.security import OAuth2PasswordBearer
from starlette.datastructures import Headers

from core.dao.botDAO import BotDAO

WEB_URL = get_env_variable("WEB_URL")
ENVRIMENT = get_env_variable("PETERCAT_ENV", "development")

ALLOW_LIST = [
  "/",
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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")
class AuthMiddleWare(BaseHTTPMiddleware):

  async def oauth(self, request: Request):
    try:
      referer = request.headers.get('referer')
      if referer and referer.startswith(WEB_URL):
        return True
      
      token = await oauth2_scheme(request=request)

      if token:
        bot_dao = BotDAO()
        bot = bot_dao.get_bot(bot_id=token)
        return bot and (
          "*" in bot.domain_whitelist
          or
          referer in bot.domain_whitelist
        )
    except HTTPException:
      return False
        
  async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
    try:
      if ENVRIMENT == "development":
        return await call_next(request)
      
      # Auth 相关的直接放过
      if request.url.path.startswith("/api/auth"):
        return await call_next(request)
      
      if request.url.path in ALLOW_LIST:
        return await call_next(request)
      
      if await self.oauth(request=request):
        response = await call_next(request)
        origin = request.headers.get("origin")

        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Vary"] = "Origin"
        return response

      if request.method == "OPTIONS" and request.url.path in ANONYMOUS_USER_ALLOW_LIST:
        return await self.preflight_response(request.headers)
      
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
        return JSONResponse(status_code=500, content={"detail": f"Internal Server Error: {e}"})

  def preflight_response(self, request_headers: Headers) -> Response:
        requested_origin = request_headers["origin"]
        headers = dict(self.preflight_headers)

        headers["Access-Control-Allow-Origin"] = requested_origin
  
        return PlainTextResponse("OK", status_code=200, headers=headers)