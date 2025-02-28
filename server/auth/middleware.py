import traceback
from typing import Awaitable, Callable

from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from core.dao.botDAO import BotDAO
from env import ENVIRONMENT, WEB_URL

ALLOW_LIST = [
    "/",
    "/token",
    "/favicon.ico",
    "/api/health_checker",
    "/api/bot/list",
    "/api/bot/detail",
    "/api/github/app/webhook",
    "/app/installation/callback",
    "/api/aws/upload",
]

ANONYMOUS_USER_ALLOW_LIST = [
    "/api/auth/userinfo",
    "/api/chat/qa",
    "/api/chat/stream_qa",
]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


class AuthMiddleWare(BaseHTTPMiddleware):

    async def oauth(self, request: Request):
        try:
            referer = request.headers.get("referer")
            origin = request.headers.get("origin")
            print(f"referer: {referer}, origin: {origin}")
            if referer and referer.startswith(WEB_URL):
                return True

            token = await oauth2_scheme(request=request)
            if token:
                bot_dao = BotDAO()
                bot = bot_dao.get_bot(bot_id=token)
                print(f"bot_id: {bot.id}")
                return bot and (
                    "*" in bot.domain_whitelist or origin in bot.domain_whitelist
                )
        except HTTPException as e:
            print(f"Error: {traceback.format_exception(e)}")
            return False

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        try:
            if ENVIRONMENT == "development":
                return await call_next(request)

            # Auth 相关的直接放过
            if request.url.path.startswith("/api/auth"):
                return await call_next(request)

            if request.url.path in ALLOW_LIST:
                return await call_next(request)

            if await self.oauth(request=request):
                return await call_next(request)

            # 获取 session 中的用户信息
            user = request.session.get("user")
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
                )

            if user["sub"].startswith("client|"):
                if request.url.path in ANONYMOUS_USER_ALLOW_LIST:
                    return await call_next(request)
                else:
                    # 如果没有用户信息，返回 401 Unauthorized 错误
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Anonymous User Not Allow",
                    )

            return await call_next(request)
        except HTTPException as e:
            print(traceback.format_exception(e))
            # 处理 HTTP 异常
            return JSONResponse(status_code=e.status_code, content={"detail": e.detail})
        except Exception as e:
            # 处理其他异常
            return JSONResponse(
                status_code=500, content={"detail": f"Internal Server Error: {e}"}
            )
