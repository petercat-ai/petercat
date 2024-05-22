from typing import AsyncIterator
from data_class import ChatData
from agent.base import AgentBuilder
from prompts.bot_template import generate_prompt_by_repo_name
from tools import issue, sourcecode, knowledge


TOOL_MAPPING = {
    "search_knowledge": knowledge.search_knowledge,
    "create_issue": issue.create_issue,
    "get_issues": issue.get_issues,
    "search_issues": issue.search_issues,
    "search_code": sourcecode.search_code,
}

def agent_stream_chat(input_data: ChatData) -> AsyncIterator[str]:
   prompt = generate_prompt_by_repo_name("ant-design")
   agent = AgentBuilder(prompt=prompt, tools=TOOL_MAPPING)
   return agent.run_stream_chat(input_data)

def agent_chat(input_data: ChatData) -> AsyncIterator[str]:
    prompt = generate_prompt_by_repo_name("ant-design")
    agent = AgentBuilder(prompt=prompt, tools=TOOL_MAPPING)
    return agent.run_chat(input_data)
