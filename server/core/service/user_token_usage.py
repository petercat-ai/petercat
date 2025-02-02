
from datetime import datetime
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

class UserTokenUsageService():
  user_token_usage_dao: UserTokenUsageDAO
  def __init__(self) -> None:
    self.user_token_usage_dao = UserTokenUsageDAO()

  def usage_stats(self, user_id: str, start_date: datetime.date, end_date: datetime.date):
    return self.user_token_usage_dao.stats(user_id=user_id, start_date=start_date, end_date=end_date)

  def analyze_token_usage(self, start_date: datetime.date, end_date: datetime.date):
    return self.user_token_usage_dao.analyze(start_date=start_date, end_date=end_date)

  def top_bots(self, start_date: datetime.date, end_date: datetime.date):
    return self.user_token_usage_dao.top_bots(start_date=start_date, end_date=end_date)

  def top_users(self, start_date: datetime.date, end_date: datetime.date):
    return self.user_token_usage_dao.top_users(start_date=start_date, end_date=end_date)

def get_user_token_usage_service():
  return UserTokenUsageService()

def create_token_recorder(user: User, bot: Bot):
  user_token_usage_dao = UserTokenUsageDAO()
  async def record_token_usage(generator: AsyncGenerator[Dict, None]):
    async for value in generator:
      try:
        match value['type']:
          case "usage":
            try:
              token_usage = UserTokenUsage(
                user_id=user.id if user else "Anonymous",
                token_id=bot.token_id or "DEFAULT_TOKEN",
                bot_id=bot.id,
                input_token=value['input_tokens'],
                output_token=value['output_tokens'],
                total_token=value['total_tokens'],
              )

              user_token_usage_dao.create(token_usage)
            except Exception as e:
              print(f"An error occurred: {e}")
          case "error":
            yield value
          case _:
            yield value
      except Exception as e:
        print(f"record_token_usage error: {e}")
        yield value
  return record_token_usage
