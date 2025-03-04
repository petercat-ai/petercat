import base64
from typing import Optional

from pydantic import BaseModel
from utils.env import get_env_variable
from core.dao.userLLmTokenDAO import UserLLMTokenDAO
from core.models.user_llm_token import UserLLMToken

from utils.private_key import get_private_key
from utils.rsa import decrypt_token, encrypt_token
from utils.sanitize_token import sanitize_token

REGION_NAME = get_env_variable("AWS_REGION")
LLM_TOKEN_SECRET_NAME = get_env_variable("LLM_TOKEN_SECRET_NAME")
LLM_TOKEN_PUBLIC_NAME = get_env_variable("LLM_TOKEN_PUBLIC_NAME")

class CreateUserLLMTokenVO(BaseModel):
  user_id: Optional[str] = None
  slug: Optional[str] = None
  llm: str
  token: Optional[str] = None

class UserLLMTokenVO(CreateUserLLMTokenVO):
  id: str

class UserLLMTokenService():
  llm_token_dao: UserLLMTokenDAO
  def __init__(self) -> None:
    self.llm_token_dao = UserLLMTokenDAO()

  def create_llm_token(self, create_llm_token_data: CreateUserLLMTokenVO):

    public_key = get_private_key(LLM_TOKEN_PUBLIC_NAME)
    encrypted_token = encrypt_token(public_key.encode('utf-8'), create_llm_token_data.token)

    encrypted_token = base64.b64encode(encrypted_token).decode('utf-8')
    
    llm_token_model = UserLLMToken(
      user_id=create_llm_token_data.user_id,
      slug=create_llm_token_data.slug,
      llm=create_llm_token_data.llm,
      encrypted_token=encrypted_token,
      sanitized_token=sanitize_token(create_llm_token_data.token),
    )

    self.llm_token_dao.create(llm_token_model)

  def get_llm_token(self, id: str, user_id: Optional[str] = None) -> UserLLMTokenVO:
    private_key_str = get_private_key(LLM_TOKEN_SECRET_NAME)

    token_model = self.llm_token_dao.get_by_id(id=id, user_id=user_id)
    encrypted_token = base64.b64decode(token_model.encrypted_token.encode('utf-8'))

    token = decrypt_token(private_key_str.encode('utf-8'), encrypted_token)

    return UserLLMTokenVO(
      **token_model.model_dump(exclude=["encrypted_token"]),
      token=token
    )

  def list_by_user(self, user_id: str):
    return self.llm_token_dao.list_by_user(user_id)
    
  def delete_llm_token(self, id: str, user_id: str):
    token_model = self.llm_token_dao.get_by_id(id=id, user_id=user_id)
    if token_model:
      return  self.llm_token_dao.delete(token_model)

def get_llm_token_service():
  return UserLLMTokenService()
