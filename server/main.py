import os

from fastapi.responses import RedirectResponse
import uvicorn

from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from auth.cors_middleware import AuthCORSMiddleWare
from i18n.translations import I18nConfig, I18nMiddleware

from auth.middleware import AuthMiddleWare
from petercat_utils import get_env_variable


# Import fastapi routers
from auth import router as auth_router
from bot import router as bot_router
from chat import router as chat_router
from rag import router as rag_router
from task import router as task_router
from github_app import router as github_app_router
from aws import router as aws_router
from user import router as user_router

AUTH0_DOMAIN = get_env_variable("AUTH0_DOMAIN")
API_AUDIENCE = get_env_variable("API_IDENTIFIER")
CLIENT_ID = get_env_variable("AUTH0_CLIENT_ID")
API_URL = get_env_variable("API_URL")
WEB_URL = get_env_variable("WEB_URL")
ENVRIMENT = get_env_variable("PETERCAT_ENV", "development")
CALLBACK_URL = f"{API_URL}/api/auth/callback"

is_dev = bool(get_env_variable("IS_DEV"))
session_secret_key = get_env_variable("FASTAPI_SECRET_KEY")
cors_origins_whitelist = get_env_variable("CORS_ORIGIN_WHITELIST") or None

app = FastAPI(title="Petercat Server", version="1.0", description="Petercat.ai APIs")

i18n_config = I18nConfig(default_language="en", translations_dir="i18n")

app.add_middleware(AuthMiddleWare)

app.add_middleware(SessionMiddleware, secret_key=session_secret_key)

cors_origins = (
    ["*"] if cors_origins_whitelist is None else cors_origins_whitelist.split(",")
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers="*",
)

app.add_middleware(AuthCORSMiddleWare)

app.add_middleware(I18nMiddleware, i18n_config=i18n_config)

app.include_router(rag_router.router)
app.include_router(bot_router.router)
app.include_router(auth_router.router)
app.include_router(chat_router.router)
app.include_router(task_router.router)
app.include_router(github_app_router.router)
app.include_router(aws_router.router)
app.include_router(user_router.router)


@app.get("/")
def home_page():
    return RedirectResponse(url=WEB_URL)


@app.get("/api/health_checker")
def health_checker():
    return {
        "ENVRIMENT": ENVRIMENT,
        "API_URL": API_URL,
        "WEB_URL": WEB_URL,
        "CALLBACK_URL": CALLBACK_URL,
    }


if __name__ == "__main__":
    if is_dev:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=int(os.environ.get("PORT", "8080")),
            reload=True,
        )
    else:
        uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))
