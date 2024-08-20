from typing import Any, List, Literal, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai.chat_models import convert_to_genai_function_declarations
from langchain_openai import ChatOpenAI

from agent.llm.base import BaseLLMClient
from petercat_utils.data_class import ImageRawURLContentBlock, MessageContent
from petercat_utils.utils.env import get_env_variable

GEMINI_API_KEY = get_env_variable("GEMINI_API_KEY")

def parse_gemini_input(message: MessageContent):
  match message.type:
    case "image_url": 
      return ImageRawURLContentBlock(image_url=message.image_url.url, type="image_url")
    case _:
      return message

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
  
  def parse_content(self, content: List[MessageContent]):
    result = [parse_gemini_input(message=message) for message in content]
    print(f"parse_content, content={content}, result={result}")
    return result
