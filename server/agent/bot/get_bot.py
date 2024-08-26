
from core.dao.botDAO import BotDAO
from core.models.bot import Bot
from petercat_utils.data_class import ChatData

def get_bot(input_data: ChatData) -> Bot:
    bot_dao = BotDAO()
    bot = bot_dao.get_bot(input_data.bot_id)
    return bot