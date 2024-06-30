import os

import uvicorn
from fastapi import FastAPI
from fastapi.responses import JSONResponse, StreamingResponse, RedirectResponse
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware

from uilts.env import get_env_variable


# Import fastapi routers
from routers import bot, health_checker, github, rag, auth, chat
AUTH0_DOMAIN = get_env_variable("AUTH0_DOMAIN")
API_AUDIENCE = get_env_variable("API_IDENTIFIER")
CLIENT_ID = get_env_variable("AUTH0_CLIENT_ID")
API_URL =  get_env_variable("API_URL")
CALLBACK_URL = f"{API_URL}/api/auth/callback"

is_dev = bool(get_env_variable("IS_DEV"))
session_secret_key = get_env_variable("FASTAPI_SECRET_KEY")
cors_origins_whitelist = get_env_variable("CORS_ORIGIN_WHITELIST") or ''
app = FastAPI( 
    title="Bo-meta Server",
    version="1.0",
    description="Agent Chat APIs"
)
    
app.add_middleware(
    SessionMiddleware,
    secret_key = session_secret_key,
)

cors_origins = ["*"] + cors_origins_whitelist.split(',')

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins, 
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"], 
)

app.include_router(health_checker.router)
app.include_router(github.router)
app.include_router(rag.router)
app.include_router(bot.router)
app.include_router(auth.router)
app.include_router(chat.router)


if __name__ == "__main__":
    if is_dev:
        uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", "8080")), reload=True)
    else:
        uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))
