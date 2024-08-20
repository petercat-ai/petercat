from typing import AsyncIterator, Optional
from agent.base import AgentBuilder
from agent.llm import get_llm
from prompts.bot_template import generate_prompt_by_repo_name
from petercat_utils import get_client
from petercat_utils.data_class import ChatData

from tools import issue, sourcecode, knowledge, git_info


def get_tools(bot_id: str, token: Optional[str]):
    issue_tools = issue.factory(access_token=token)
    return {
        "search_knowledge": knowledge.factory(bot_id=bot_id),
        "create_issue": issue_tools["create_issue"],
        "get_issues": issue_tools["get_issues"],
        "search_issues": issue_tools["search_issues"],
        "search_code": sourcecode.search_code,
        "search_repo": git_info.search_repo,
    }


def init_prompt(input_data: ChatData):
    if input_data.prompt:
        prompt = input_data.prompt
    elif input_data.bot_id:
        try:
            supabase = get_client()
            res = (
                supabase.table("bots")
                .select("prompt")
                .eq("id", input_data.bot_id)
                .execute()
            )
            prompt = res.data[0]["prompt"]
        except Exception as e:
            print(e)
            prompt = generate_prompt_by_repo_name("ant-design")
    else:
        prompt = generate_prompt_by_repo_name("ant-design")

    return prompt


def agent_stream_chat(input_data: ChatData, user_token: str, llm: Optional[str] = "openai") -> AsyncIterator[str]:
    agent = AgentBuilder(
        chat_model=get_llm(llm=llm),
        prompt=init_prompt(input_data),
        tools=get_tools(bot_id=input_data.bot_id, token=user_token),
    )
    return agent.run_stream_chat(input_data)


def agent_chat(input_data: ChatData, user_token: Optional[str], llm: Optional[str] = "openai") -> AsyncIterator[str]:
    agent = AgentBuilder(
        chat_model=get_llm(llm=llm),
        prompt=init_prompt(input_data),
        tools=get_tools(input_data.bot_id, token=user_token),
    )
    return agent.run_chat(input_data)
