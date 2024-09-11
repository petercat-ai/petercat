
from typing import AsyncGenerator, Dict, Optional
from pydantic import BaseModel

from agent.bot import Bot
from core.dao.userTokenUsageDAO import UserTokenUsageDAO
from core.models.user import User
from core.models.user_token_usage import UserTokenUsage


class TokenUsageVO(BaseModel):
  user_id: str
  token_id: str
  input_token: Optional[int] = 0
  output_token: Optional[int] = 0
  total_token: Optional[int] = 0


def create_token_recorder(user: User, bot: Bot):
  user_token_usage_dao = UserTokenUsageDAO()
  async def record_token_usage(generator: AsyncGenerator[Dict, None]):
    async for value in generator:
      
      match value['type']:
        case "usage":
          try:
            token_usage = UserTokenUsage(
              user_id=user.id if user else "Anonymous",
              token_id=bot.token_id or "DEFAULT_TOKEN",
              bot_id=bot.id,
              input_token=value['input_tokens'],
              output_token=value['output_tokens'],
              total_tokens=value['total_tokens'],
            )

            user_token_usage_dao.create(token_usage)
          except Exception as e:
            print(f"An error occurred: {e}")
        case _:
          yield value
  return record_token_usage
