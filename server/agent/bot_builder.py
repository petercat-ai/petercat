from typing import AsyncIterator, Optional
from data_class import ChatData
from agent.base import AgentBuilder
from prompts.bot_builder import generate_prompt_by_user_id
from tools import bot_builder


TOOL_MAPPING = {
    "create_bot": bot_builder.create_bot,
    "edit_bot": bot_builder.edit_bot,
}

def agent_stream_chat(input_data: ChatData, user_id: str, bot_id: Optional[str] = None) -> AsyncIterator[str]:
    prompt = generate_prompt_by_user_id(user_id, bot_id)
    agent = AgentBuilder(prompt=prompt, tools=TOOL_MAPPING, enable_tavily=False)
    return agent.run_stream_chat(input_data)
