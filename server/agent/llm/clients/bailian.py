

from typing import Any, List, Optional
from langchain_openai import ChatOpenAI
from langchain_core.utils.function_calling import convert_to_openai_tool

from agent.llm import register_llm_client
from agent.llm.base import BaseLLMClient

from petercat_utils.data_class import MessageContent
from petercat_utils import get_env_variable

DASHSCOPE_API_KEY = get_env_variable("DASHSCOPE_API_KEY")


@register_llm_client("dashscope")
class DashScopeClient(BaseLLMClient):
    _client: ChatOpenAI

    def __init__(
        self,
        temperature: Optional[float] = 0.2,
        n: Optional[int] = 1,
        top_p: Optional[float] = None,
        max_tokens: Optional[int] = 1500,
        streaming: Optional[bool] = False,
        api_key: Optional[str] = DASHSCOPE_API_KEY,
    ):
        self._client = ChatOpenAI(
            model_name="deepseek-v3",
            temperature=temperature,
            n=n,
            top_p=top_p,
            streaming=streaming,
            max_tokens=max_tokens,
            openai_api_key=api_key,
            stream_usage=True,
            openai_api_base="https://dashscope.aliyuncs.com/compatible-mode/v1"
        )

    def get_client(self):
        return self._client

    def get_tools(self, tools: List[Any]):
        return [convert_to_openai_tool(tool) for tool in tools]

    def parse_content(self, content: List[MessageContent]):
        return [c.model_dump() for c in content]