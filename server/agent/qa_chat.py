from typing import AsyncIterator
from data_class import ChatData
from agent.base import AgentBuilder
from prompts.bot_template import generate_prompt_by_repo_name
from db.supabase.client import get_client
from tools import issue, sourcecode, knowledge


TOOL_MAPPING = {
    "search_knowledge": knowledge.search_knowledge,
    "create_issue": issue.create_issue,
    "get_issues": issue.get_issues,
    "search_issues": issue.search_issues,
    "search_code": sourcecode.search_code,
}

def init_prompt(input_data: ChatData):
    if input_data.prompt:
       prompt = input_data.prompt
    elif input_data.bot_id:
        supabase = get_client()
        res=supabase.table("bots").select('prompt').eq('id', input_data.bot_id).execute()
        print('data', res.data[0]['prompt'])
        prompt = res.data[0]['prompt']
    else:
       prompt = generate_prompt_by_repo_name("ant-design")
   
    return prompt

def agent_stream_chat(input_data: ChatData) -> AsyncIterator[str]:
    agent = AgentBuilder(prompt=init_prompt(input_data), tools=TOOL_MAPPING)
    return agent.run_stream_chat(input_data)

def agent_chat(input_data: ChatData) -> AsyncIterator[str]:
    agent = AgentBuilder(prompt=init_prompt(input_data), tools=TOOL_MAPPING)
    return agent.run_chat(input_data)
