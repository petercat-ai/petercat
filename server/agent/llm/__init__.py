from typing import Optional
from agent.llm.base import BaseLLMClient
from agent.llm.gemini import GeminiClient
from agent.llm.openai import OpenAIClient
from core.models.llm_token import LLMToken


class LLM():
  llm_token: LLMToken
  client: Optional[BaseLLMClient]
  
  def __init__(self, llm_token: LLMToken):
    self._llm_token = llm_token
    self._client = self.get_llm_client(llm_token.llm, api_key=llm_token.token)
  
  def get_llm_client(
    self,
    llm: str = 'openai',
    api_key: Optional[str | None] = None,
    temperature: Optional[int] = 0.2,
    max_tokens: Optional[int] = 1500,
    streaming: Optional[bool] = False
  ) -> BaseLLMClient:
    print(f"get_llm_client={llm}, api_key={api_key}")
    match llm:
      case "openai":
        return OpenAIClient(temperature=temperature, api_key=api_key, streaming=streaming, max_tokens=max_tokens)
      case "gemini":
        return GeminiClient(temperature=temperature, api_key=api_key, streaming=streaming, max_tokens=max_tokens)
    return None