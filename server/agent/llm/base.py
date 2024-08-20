
from abc import abstractmethod
from typing import Any, Dict, List, Optional
from langchain_core.language_models import BaseChatModel

from petercat_utils.data_class import MessageContent

class BaseLLMClient():
  def __init__(self, temperature: Optional[int] = 0.2, max_tokens: Optional[int] = 1500, streaming: Optional[bool] = False):
    pass

  @abstractmethod
  def get_client() -> BaseChatModel:
    pass

  @abstractmethod
  def get_tools(self, tool: List[Any]) -> list[Dict[str, Any]]:
    pass

  @abstractmethod
  def parse_content(self, content: List[MessageContent]) -> List[MessageContent]:
    pass