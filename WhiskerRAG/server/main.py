import os
from core.plugin_manager import PluginManager
from model.response import ResponseModel
from api.knowledge import router as knowledge_router
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse, RedirectResponse
from core.config import settings

app = FastAPI()
app.include_router(knowledge_router.router)


@app.get("/")
def home_page():
    return RedirectResponse(url=settings.WEB_URL)


@app.get("/api/health_checker", response_model=ResponseModel)
def health_checker():
    return {success: True, message: "Server is running"}


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "message": exc.detail},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": str(exc)},
    )


@app.on_event("startup")
async def startup_event():
    # 读取配置加载 plugins 文件夹下的 任务引擎、数据引擎插件
    path = os.path.abspath(os.path.dirname(__file__))
    PluginManager(path)
