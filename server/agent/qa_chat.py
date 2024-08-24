from typing import AsyncIterator, Optional
from github import Auth
from agent.base import AgentBuilder
from agent.llm import get_llm
from core.dao.botDAO import BotDAO
from core.models.bot import Bot
from agent.prompts.bot_template import generate_prompt_by_repo_name
from petercat_utils.data_class import ChatData

from agent.tools import issue, sourcecode, knowledge, git_info


def get_tools(bot: Bot, token: Optional[Auth.Token]):
    issue_tools = issue.factory(token=token)
    return {
        "search_knowledge": knowledge.factory(bot_id=bot.id),
        "create_issue": issue_tools["create_issue"],
        "get_issues": issue_tools["get_issues"],
        "search_issues": issue_tools["search_issues"],
        "search_code": sourcecode.search_code,
        "search_repo": git_info.search_repo,
    }

def agent_stream_chat(input_data: ChatData, token: Auth.Token) -> AsyncIterator[str]:
    bot_dao = BotDAO()
    bot = bot_dao.get_bot(input_data.bot_id)

    agent = AgentBuilder(
        chat_model=get_llm(bot.llm),
        prompt=bot.prompt or generate_prompt_by_repo_name("ant-design"),
        tools=get_tools(bot=bot, token=token),
    )
    return agent.run_stream_chat(input_data)


def agent_chat(input_data: ChatData, token: Auth.Token) -> AsyncIterator[str]:
    bot_dao = BotDAO()
    bot = bot_dao.get_bot(input_data.bot_id)

    prompt = bot.prompt or generate_prompt_by_repo_name("ant-design")
    if input_data.prompt is not None:
        prompt = f"{prompt}\n\n{input_data.prompt}"
    print(f"agent_chat: prompt={prompt}")

    agent = AgentBuilder(
        chat_model=get_llm(bot.llm),
        prompt=prompt,
        tools=get_tools(bot, token=token),
    )

    return agent.run_chat(input_data)
