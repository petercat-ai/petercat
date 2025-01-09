from abc import ABC, abstractmethod
from core.config import Settings


class DBPluginInterface(ABC):

    @abstractmethod
    def __init__(self, settings: Settings):
        pass

    @abstractmethod
    async def getBotById(self, bot_id: str) -> dict:
        pass
