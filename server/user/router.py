

from typing import Annotated
from fastapi import APIRouter, Depends

from auth.get_user_info import get_user_id
from core.service.user_llm_token import UserLLMTokenService, CreateUserLLMTokenVO, get_llm_token_service

router = APIRouter(
    prefix="/api/user",
    tags=["user"],
    responses={404: {"description": "Not found"}},
)

@router.post("/llm_token")
def create_token(
  llm_token: CreateUserLLMTokenVO,
  user_id: Annotated[str | None, Depends(get_user_id)] = None,
  llm_service: Annotated[UserLLMTokenService | None, Depends(get_llm_token_service)] = None
):
  llm_token.user_id = user_id

  return llm_service.create_llm_token(llm_token)

@router.get("/llm_token/{token_id}")
def get_token(
  token_id: str,
  user_id: Annotated[str | None, Depends(get_user_id)] = None,
  llm_service: Annotated[UserLLMTokenService | None, Depends(get_llm_token_service)] = None
):
  
  return llm_service.get_llm_token(id=token_id, user_id=user_id)

@router.get("/llm_tokens")
def list_by_user(
  user_id: Annotated[str | None, Depends(get_user_id)] = None,
  llm_service: Annotated[UserLLMTokenService | None, Depends(get_llm_token_service)] = None
):
    return llm_service.list_by_user(user_id)

@router.delete("/llm_token/{token_id}")
def delete_token(
  token_id: str,
  user_id: Annotated[str | None, Depends(get_user_id)] = None,
  llm_service: Annotated[UserLLMTokenService | None, Depends(get_llm_token_service)] = None
):
  
  return llm_service.delete_llm_token(id=token_id, user_id=user_id)