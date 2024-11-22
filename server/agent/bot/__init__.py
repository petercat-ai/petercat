from core.models.bot import BotModel
from agent.llm import LLM, LLMTokenLike


class Bot:
    _bot: BotModel
    _llm: LLM
    _llm_token: LLMTokenLike

    def __init__(self, bot: BotModel, llm_token: LLMTokenLike):
        self._bot = bot
        self._llm_token = llm_token
        self._llm = LLM(
            llm_token=llm_token,
            temperature=bot.temperature,
            n=bot.n,
            top_p=bot.top_p,
        )

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

    @property
    def token_id(self):
        return self._bot.token_id

    @property
    def repo_name(self):
        return self._bot.repo_name
