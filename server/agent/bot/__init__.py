from core.models.bot import BotModel
from core.models.llm_token import LLMToken
from agent.llm import LLM

class Bot:
    _bot: BotModel
    _llm: LLM
    _llm_token: LLMToken
    def __init__(self, bot: BotModel, llm_token: LLMToken):
        self._bot = bot
        self._llm_token = llm_token
        self._llm = LLM(llm_token=llm_token)

    @property
    def id(self):
        return self._bot.id
    
    @property
    def prompt(self):
        return self._bot.prompt

    @property
    def llm_token(self):
        return self._llm_token

    @property
    def llm(self):
        return self._llm._client
