from typing import AsyncIterator
from agent.bot.get_bot import Bot
from petercat_utils.data_class import ChatData

from agent.base import AgentBuilder
from agent.prompts.bot_builder import generate_prompt_by_user_id
from agent.tools import bot_builder


TOOL_MAPPING = {
    "create_bot": bot_builder.create_bot,
    "edit_bot": bot_builder.edit_bot,
}


def agent_stream_chat(
    input_data: ChatData, 
    user_id: str,
    bot: Bot,
) -> AsyncIterator[str]:
    prompt = generate_prompt_by_user_id(user_id, bot.id)
    agent = AgentBuilder(
        chat_model=bot.llm,
        prompt=prompt, tools=TOOL_MAPPING, enable_tavily=False
    )
    return agent.run_stream_chat(input_data)
