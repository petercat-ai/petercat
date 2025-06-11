import json
from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from github import Github
from openai import BaseModel
from pydantic import Field
from auth.get_user_info import get_user
from core.models.user import User
from utils.env import get_env_variable
from whiskerrag_client import APIClient
from whiskerrag_types.model import (
    PageParams,
    Knowledge,
    Task,
    Chunk,
    GithubRepoCreate,
    KnowledgeTypeEnum,
    KnowledgeSourceEnum,
    GithubRepoSourceConfig,
    EmbeddingModelEnum,
    GithubRepoParseConfig,
    RetrievalChunk,
    RetrievalBySpaceRequest
)
from auth.rate_limit import verify_rate_limit


class RetrievalByBotRequest(BaseModel):
    question: str = Field(..., description="question")
    bot_id_list: List[str] = Field([], description="petercat bot id")
    repo_name_list:List[str] =  Field([], description="github repo name list")
    top: Optional[int] = Field(10, description="top k", ge=1, le=500)
    similarity_threshold: Optional[float] = Field(0.6, description="similarity threshold",ge=0.0,le=1.0)
    metadata_filter:Optional[dict]=Field({}, description="metadata filter")
    class Config:
            extra = "forbid"

router = APIRouter(
    prefix="/api/rag",
    tags=["rag"],
    responses={404: {"description": "Not found"}},
)


class ReloadRepoRequest(BaseModel):
    repo_name: str


class RestartTaskRequest(BaseModel):
    task_id_list: List[str]


@router.post("/knowledge/repo/reload", dependencies=[Depends(verify_rate_limit)])
async def reload_repo(
    request: ReloadRepoRequest,
    user: Annotated[User | None, Depends(get_user)] = None,
):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Github Login needed"
        )
    try:
        # check api_url and api_key is set
        if not get_env_variable("WHISKER_API_URL") or not get_env_variable("WHISKER_API_KEY"):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="WHISKER_API_URL or WHISKER_API_KEY is not set"
            )
        api_client = APIClient(
            base_url=get_env_variable("WHISKER_API_URL"),
            token=get_env_variable("WHISKER_API_KEY"),
        )
        github_client = Github(user.access_token)
        repo = github_client.get_repo(request.repo_name)
        # use gitpython to get the latest commit sha
        commit = repo.get_commits()[0]
        file_sha = commit.sha
        res = await api_client.knowledge.add_knowledge(
            [
                 GithubRepoCreate(
                            source_type=KnowledgeSourceEnum.GITHUB_REPO,
                            knowledge_type=KnowledgeTypeEnum.GITHUB_REPO,
                            space_id=request.repo_name,
                            knowledge_name=request.repo_name,
                            embedding_model_name=EmbeddingModelEnum.OPENAI,
                            source_config=GithubRepoSourceConfig(
                                repo_name=request.repo_name,
                                auth_token=user.access_token,
                                url="https://github.com"
                            ),
                            split_config=GithubRepoParseConfig(
                                type="github_repo",
                                include_patterns=["*.md", "*.txt","*.ts","*.tsx","*.mdx"],
                                ignore_patterns=[".git", ".DS_Store", "Thumbs.db", "desktop.ini"],
                                use_gitignore=True,
                                use_default_ignore=True,
                                chunk_size=1500,
                                chunk_overlap=200,
                            ),
                            file_sha=file_sha,
                        )
            ]
        )
        return res
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


@router.post("/knowledge/list", dependencies=[Depends(verify_rate_limit)])
async def get_knowledge_list(
    params: PageParams[Knowledge],
    user: Annotated[User | None, Depends(get_user)] = None,
):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Github Login needed"
        )
    try:
        api_client = APIClient(
            base_url=get_env_variable("WHISKER_API_URL"),
            token=get_env_variable("WHISKER_API_KEY"),
        )
        res = await api_client.knowledge.get_knowledge_list(**params.model_dump())
        return res.model_dump()
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
        return res.model_dump()
    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})


@router.post("/task/list", dependencies=[Depends(verify_rate_limit)])
async def get_rag_task(
    params: PageParams[Task],
    user: Annotated[User | None, Depends(get_user)] = None,
):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Github Login needed"
        )
    try:
        api_client = APIClient(
            base_url=get_env_variable("WHISKER_API_URL"),
            token=get_env_variable("WHISKER_API_KEY"),
        )
        res = await api_client.task.get_task_list(**params.model_dump())
        return res.model_dump()
    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})


@router.post("/task/restart", dependencies=[Depends(verify_rate_limit)])
async def restart_rag_task(
    params: RestartTaskRequest,
    user: Annotated[User | None, Depends(get_user)] = None,
):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Github Login needed"
        )
    try:
        api_client = APIClient(
            base_url=get_env_variable("WHISKER_API_URL"),
            token=get_env_variable("WHISKER_API_KEY"),
        )
        res = await api_client.task.restart_task(params.task_id_list)
        return res.model_dump()
    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})


@router.post("/retrieval/bot", dependencies=[Depends(verify_rate_limit)])
async def retrievalBot(
    params: RetrievalByBotRequest,
    user: Annotated[User | None, Depends(get_user)] = None,
)->List[RetrievalChunk]:
    bot_id_list = params.bot_id_list
    repo_name_list = params.repo_name_list
    space_id_list = repo_name_list + bot_id_list
    if len(space_id_list) == 0:
        raise HTTPException(
            status_code=400,
            detail="At least one of bot_id_list and repo_name_list must not be empty",
        )
    api_client = APIClient(
        base_url=get_env_variable("WHISKER_API_URL"),
        token=get_env_variable("WHISKER_API_KEY"),
        timeout=30,
    )
    retrieval_res = await api_client.retrieval.retrieve_space_content(
        RetrievalBySpaceRequest(
            space_id_list=space_id_list,
            question=params.question,
            embedding_model_name=EmbeddingModelEnum.OPENAI,
            similarity_threshold=params.similarity_threshold,
            top=params.top,
            metadata_filter=params.metadata_filter,
        )
    )
    return retrieval_res