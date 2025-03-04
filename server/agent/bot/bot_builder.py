from typing import AsyncIterator
from agent.llm.clients.openai import OpenAIClient
from core.type_class.data_class import ChatData

from agent.base import AgentBuilder, dict_to_sse
from agent.prompts.bot_builder import generate_prompt_by_user_id
from agent.tools import bot_builder

TOOL_MAPPING = {
    "create_bot": bot_builder.create_bot,
    "edit_bot": bot_builder.edit_bot,
}


def agent_stream_chat(
    input_data: ChatData,
    user_id: str,
    bot_id: str,
) -> AsyncIterator[str]:
    prompt = generate_prompt_by_user_id(user_id, bot_id)
    agent = AgentBuilder(
        chat_model=OpenAIClient(),
        prompt=prompt,
        tools=TOOL_MAPPING,
        enable_tavily=False,
    )
    return dict_to_sse(agent.run_stream_chat(input_data))
