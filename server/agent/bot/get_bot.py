
from typing import Annotated

from fastapi import Depends
from agent.bot import Bot
from auth.get_user_info import get_user
from core.dao.botDAO import BotDAO
from core.dao.llmTokenDAO import LLMTokenDAO

from core.models.user import User
from petercat_utils.data_class import ChatData

def get_bot(input_data: ChatData, user: Annotated[User | None, Depends(get_user)] = None,) -> Bot:
    bot_dao = BotDAO()
    llm_token_dao = LLMTokenDAO()

    bot = bot_dao.get_bot(input_data.bot_id)

    llm_token = llm_token_dao.get_llm_token(free=True) \
                if getattr(user, "anonymous", False) \
                else llm_token_dao.get_llm_token(bot.llm)

    return Bot(bot=bot, llm_token=llm_token)

def get_bot_by_id(bot_id: str) -> Bot:
    bot_dao = BotDAO()
    llm_token_dao = LLMTokenDAO()

    bot = bot_dao.get_bot(bot_id)
    llm_token = llm_token_dao.get_llm_token(bot.llm)
    return Bot(bot=bot, llm_token=llm_token)