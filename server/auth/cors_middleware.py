
from typing import Awaitable, Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import PlainTextResponse

from auth.middleware import ANONYMOUS_USER_ALLOW_LIST


class AuthCORSMiddleWare(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
        response = await call_next(request)
        requested_origin = request.headers.get('origin')
        if requested_origin is None:
            return response

        if request.url.path in ANONYMOUS_USER_ALLOW_LIST:
            if request.method == "OPTIONS":
                headers = self.mutate_cors_headers(request, response)
                return PlainTextResponse("OK", status_code=200, headers=headers)
            if response.status_code == 200:
                self.mutate_cors_headers(request, response)

                return response
        return response

    def mutate_cors_headers(self, request: Request, response: Response):
        requested_origin = request.headers.get('origin')
        headers = response.headers

        headers["Access-Control-Allow-Origin"] = requested_origin
        return headers
