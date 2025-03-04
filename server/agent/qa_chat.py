from typing import AsyncIterator, Dict, Optional
from github import Auth
from agent.base import AgentBuilder
from agent.bot import Bot

from core.type_class.data_class import ChatData

from agent.tools import issue, pull_request, auth, sourcecode, knowledge, git_info


def get_tools(bot: Bot, auth_token: Optional[Auth.Token]):
    login_tools = auth.factory(token=auth_token)
    issue_tools = issue.factory(token=auth_token)
    pull_request_tools = pull_request.factory(token=auth_token)
    sourcecode_tools = sourcecode.factory(token=auth_token)

    return {
        "check_login": login_tools["check_login"],
        "search_knowledge": knowledge.factory(bot_id=bot.id),
        "create_issue": issue_tools["create_issue"],
        "get_issues": issue_tools["get_issues"],
        "get_file_content": pull_request_tools["get_file_content"],
        "create_review_comment": pull_request_tools["create_review_comment"],
        "create_pr_summary": pull_request_tools["create_pr_summary"],
        "search_issues": issue_tools["search_issues"],
        "search_code": sourcecode_tools["search_code"],
        "search_repo": git_info.search_repo,
    }


def agent_stream_chat(
    input_data: ChatData, auth_token: Auth.Token, bot: Bot
) -> AsyncIterator[Dict]:
    agent = AgentBuilder(
        chat_model=bot.llm,
        prompt=bot.prompt,
        tools=get_tools(bot=bot, auth_token=auth_token),
    )
    return agent.run_stream_chat(input_data)


def agent_chat(
    input_data: ChatData, auth_token: Auth.Token, bot: Bot
) -> AsyncIterator[str]:

    prompt = bot.prompt

    if input_data.prompt is not None:
        prompt = f"{prompt}\n\n{input_data.prompt}"

    agent = AgentBuilder(
        chat_model=bot.llm,
        prompt=prompt,
        tools=get_tools(bot, auth_token=auth_token),
    )

    return agent.run_chat(input_data)
