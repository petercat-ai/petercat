from typing import Optional

from langchain_core.language_models import BaseChatModel
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI

from agent.llm.base import BaseLLMClient
from agent.llm.gemini import GeminiClient
from agent.llm.openai import OpenAIClient
from petercat_utils.utils.env import get_env_variable

OPEN_API_KEY = get_env_variable("OPENAI_API_KEY")
GEMINI_API_KEY = get_env_variable("GEMINI_API_KEY")

def get_llm(
    llm: str = 'openai',
    temperature: Optional[int] = 0.2,
    max_tokens: Optional[int] = 1500,
    streaming: Optional[bool] = False
  ) -> BaseLLMClient:

  match llm:
    case "openai":
      return OpenAIClient(temperature=temperature, streaming=streaming, max_tokens=max_tokens)
    case "gemini":
      return GeminiClient(temperature=temperature,streaming=streaming, max_tokens=max_tokens)
  return None