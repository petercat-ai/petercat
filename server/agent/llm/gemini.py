from typing import Any, List, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai.chat_models import convert_to_genai_function_declarations
from langchain_openai import ChatOpenAI
from langchain_core.utils.function_calling import convert_to_openai_tool

from agent.llm.base import BaseLLMClient
from petercat_utils.utils.env import get_env_variable

GEMINI_API_KEY = get_env_variable("GEMINI_API_KEY")

class GeminiClient(BaseLLMClient):
  _client: ChatOpenAI

  def __init__(self, temperature: Optional[int] = 0.2, max_tokens: Optional[int] = 1500, streaming: Optional[bool] = False):
    self._client = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=temperature,
        streaming=streaming,
        max_tokens=max_tokens,
        google_api_key=GEMINI_API_KEY,
    )
  
  def get_client(self):
    return self._client
  
  def get_tools(self, tools: List[Any]):
    return [convert_to_genai_function_declarations(tool) for tool in tools]