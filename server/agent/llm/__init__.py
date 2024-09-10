import importlib
import os
from typing import Dict, Optional, Type
from agent.llm.base import BaseLLMClient
from core.models.llm_token import LLMToken

llm_client_registry: Dict[str, Type['BaseLLMClient']] = {}

def register_llm_client(name: str):
    """Decorator to register a new LLM client class."""
    def decorator(cls):
        if name in llm_client_registry:
            raise ValueError(f"Client '{name}' is already registered.")
        llm_client_registry[name] = cls
        return cls
    return decorator

def get_registered_llm_client():
   return llm_client_registry

def import_clients(directory: str = 'clients'):
    """Dynamically import all Python modules in the given directory."""
    # 获取当前文件的绝对路径
    current_dir = os.path.dirname(os.path.abspath(__file__))
    clients_dir = os.path.join(current_dir, directory)
    
    for filename in os.listdir(clients_dir):
        if filename.endswith('.py') and not filename.startswith('__'):
            module_name = f"agent.llm.{directory}.{filename[:-3]}"  # 去掉 .py 后缀
            importlib.import_module(module_name)

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

    """Get an LLM client based on the specified name."""
    if llm in llm_client_registry:
        client_class = llm_client_registry[llm]
        return client_class(temperature=temperature, api_key=api_key, streaming=streaming, max_tokens=max_tokens)
    
    return None