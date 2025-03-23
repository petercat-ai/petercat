from datetime import datetime, timedelta
from typing import Annotated
from fastapi import APIRouter, Depends

from agent.llm import get_registered_llm_client, import_clients
from auth.get_user_info import get_user_id
from auth.verify_admin import verify_admin
from core.service.user_llm_token import (
    UserLLMTokenService,
    CreateUserLLMTokenVO,
    get_llm_token_service,
)
from core.service.user_token_usage import (
    UserTokenUsageService,
    get_user_token_usage_service,
)

router = APIRouter(
    prefix="/api/user",
    tags=["user"],
    responses={404: {"description": "Not found"}},
)


@router.get("/llms")
def get_avaliable_llms():
    return ["openai", "gemini"]


@router.post("/llm_token")
def create_token(
    llm_token: CreateUserLLMTokenVO,
    user_id: Annotated[str | None, Depends(get_user_id)] = None,
    llm_service: Annotated[
        UserLLMTokenService | None, Depends(get_llm_token_service)
    ] = None,
):
    llm_token.user_id = user_id

    return llm_service.create_llm_token(llm_token)


@router.get("/llm_token/{token_id}")
def get_token(
    token_id: str,
    user_id: Annotated[str | None, Depends(get_user_id)] = None,
    llm_service: Annotated[
        UserLLMTokenService | None, Depends(get_llm_token_service)
    ] = None,
):

    return llm_service.get_llm_token(id=token_id, user_id=user_id)


@router.get("/llm_tokens")
def list_by_user(
    user_id: Annotated[str | None, Depends(get_user_id)] = None,
    llm_service: Annotated[
        UserLLMTokenService | None, Depends(get_llm_token_service)
    ] = None,
):
    return llm_service.list_by_user(user_id)


@router.delete("/llm_token/{token_id}")
def delete_token(
    token_id: str,
    user_id: Annotated[str | None, Depends(get_user_id)] = None,
    llm_service: Annotated[
        UserLLMTokenService | None, Depends(get_llm_token_service)
    ] = None,
):
    print(f"delete_llm_token, token={token_id}, user_id={user_id}")
    llm_service.delete_llm_token(id=token_id, user_id=user_id)
    return {}


@router.get("/llm_token_usages")
def token_usage(
    start_date: datetime,
    end_date: datetime,
    user_id: Annotated[str | None, Depends(get_user_id)] = None,
    user_token_usage_service: Annotated[
        UserTokenUsageService | None, Depends(get_user_token_usage_service)
    ] = None,
):
    return user_token_usage_service.usage_stats(
        user_id=user_id, start_date=start_date, end_date=end_date
    )


@router.get("/llm_token_usages/analyzer", dependencies=[Depends(verify_admin)])
def token_usage_analyze(
    start_date: datetime = datetime.now() - timedelta(days=30),
    end_date: datetime = datetime.now(),
    user_token_usage_service: Annotated[
        UserTokenUsageService | None, Depends(get_user_token_usage_service)
    ] = None,
):
    return user_token_usage_service.analyze_token_usage(
        start_date=start_date, end_date=end_date
    )


@router.get("/llm_token_usages/top_bots", dependencies=[Depends(verify_admin)])
def top_used_bots(
    start_date: datetime = datetime.now() - timedelta(days=30),
    end_date: datetime = datetime.now(),
    user_token_usage_service: Annotated[
        UserTokenUsageService | None, Depends(get_user_token_usage_service)
    ] = None,
):
    return user_token_usage_service.top_bots(start_date=start_date, end_date=end_date)


@router.get("/llm_token_usages/top_users", dependencies=[Depends(verify_admin)])
def top_used_users(
    start_date: datetime = datetime.now() - timedelta(days=30),
    end_date: datetime = datetime.now(),
    user_token_usage_service: Annotated[
        UserTokenUsageService | None, Depends(get_user_token_usage_service)
    ] = None,
):
    return user_token_usage_service.top_users(start_date=start_date, end_date=end_date)
