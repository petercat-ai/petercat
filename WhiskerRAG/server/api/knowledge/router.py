from typing import Optional
from core.plugin_manager import PluginManager
from fastapi import APIRouter


router = APIRouter(
    prefix="/api/knowledge",
    tags=["knowledge input"],
    responses={404: {"description": "Not found"}},
)


@router.post("/getbot")
async def get_bot(bot_id: str):
    client = PluginManager().dbPlugin
    response = client.getBotById(bot_id)
    print(response)
    return response


@router.post("/github/repo/add")
async def add_github_repo(
    repo_name: str,
    user_id: str = None,
    auth_token: str = None,
):
    return


@router.post("/github/repo_file/add")
async def add_github_repo_file(
    file_path: str,
    auth_token: str = None,
):
    return
