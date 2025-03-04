
from typing import Annotated

from fastapi import Depends
from agent.bot import Bot
from agent.llm import import_clients
from auth.get_user_info import get_user
from core.dao.botDAO import BotDAO
from core.dao.llmTokenDAO import LLMTokenDAO

from core.models.user import User
from core.service.user_llm_token import UserLLMTokenService, get_llm_token_service
from petercat_utils.data_class import ChatData

def get_bot(
        input_data: ChatData, 
        user: Annotated[User | None, Depends(get_user)] = None,
        llm_service: Annotated[UserLLMTokenService | None, Depends(get_llm_token_service)] = None
    ) -> Bot:

    import_clients()

    bot_dao = BotDAO()
    llm_token_dao = LLMTokenDAO()

    bot = bot_dao.get_bot(input_data.bot_id)

    # 如果是匿名，强行走 free
    if not getattr(user, "anonymous", False):
        llm_token = llm_token_dao.get_llm_token(free=True)
    elif bot.token_id:
        llm_token = llm_service.get_llm_token(id=bot.token_id)
    else:
        llm_token = llm_token_dao.get_llm_token(bot.llm)

    print(f"get_bot, bot={bot}, llm_token={llm_token}")
    return Bot(bot=bot, llm_token=llm_token)

def get_bot_by_id(bot_id: str) -> Bot:
    bot_dao = BotDAO()
    llm_token_dao = LLMTokenDAO()

    bot = bot_dao.get_bot(bot_id)
    llm_token = llm_token_dao.get_llm_token(bot.llm)
    return Bot(bot=bot, llm_token=llm_token)