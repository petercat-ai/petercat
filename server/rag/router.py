import json
from typing import Annotated

from fastapi import APIRouter, Depends
from openai import BaseModel
from auth.get_user_info import get_user
from core.models.user import User
from utils.env import get_env_variable
from whiskerrag_client import APIClient
from whiskerrag_types.model import (
    PageParams,
    Knowledge,
    Task,
    Chunk,
    KnowledgeCreate,
    KnowledgeTypeEnum,
    KnowledgeSourceEnum,
    GithubRepoSourceConfig,
    KnowledgeSplitConfig,
)
from auth.rate_limit import verify_rate_limit

router = APIRouter(
    prefix="/api/rag",
    tags=["rag"],
    responses={404: {"description": "Not found"}},
)


class ReloadRepoRequest(BaseModel):
    repo_name: str


@router.post("/knowledge/repo/reload", dependencies=[Depends(verify_rate_limit)])
async def reload_repo(
    request: ReloadRepoRequest,
    user: Annotated[User | None, Depends(get_user)] = None,
):
    try:
        api_client = APIClient(
            base_url=get_env_variable("WHISKER_API_URL"),
            token=get_env_variable("WHISKER_API_KEY"),
        )
        res = await api_client.knowledge.add_knowledge(
            [
                KnowledgeCreate(
                    source_type=KnowledgeSourceEnum.GITHUB_REPO,
                    knowledge_type=KnowledgeTypeEnum.FOLDER,
                    space_id=request.repo_name,
                    knowledge_name=request.repo_name,
                    source_config=GithubRepoSourceConfig(
                        repo_name=request.repo_name, auth_token=user.access_token
                    ),
                    split_config=KnowledgeSplitConfig(
                        chunk_size=500,
                        chunk_overlap=100,
                    ),
                )
            ]
        )
        return res
    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})


@router.post("/knowledge/list", dependencies=[Depends(verify_rate_limit)])
async def get_knowledge_list(params: PageParams[Knowledge]):
    try:
        api_client = APIClient(
            base_url=get_env_variable("WHISKER_API_URL"),
            token=get_env_variable("WHISKER_API_KEY"),
        )
        res = await api_client.knowledge.get_knowledge_list(**params.model_dump())
        return res
    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})


@router.post("/chunk/list", dependencies=[Depends(verify_rate_limit)])
async def get_chunk_list(params: PageParams[Chunk]):
    try:
        api_client = APIClient(
            base_url=get_env_variable("WHISKER_API_URL"),
            token=get_env_variable("WHISKER_API_KEY"),
        )
        res = await api_client.chunk.get_chunk_list(**params.model_dump())
        return res
    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})


@router.post("/task/list", dependencies=[Depends(verify_rate_limit)])
async def get_rag_task(params: PageParams[Task]):
    try:
        api_client = APIClient(
            base_url=get_env_variable("WHISKER_API_URL"),
            token=get_env_variable("WHISKER_API_KEY"),
        )
        res = await api_client.task.get_task_list(**params.model_dump())
        return res
    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})
