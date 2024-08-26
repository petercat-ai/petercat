import json
import traceback
from typing import AsyncIterator, Dict, Callable, Optional
from langchain.agents import AgentExecutor
from agent.llm.base import BaseLLMClient
from petercat_utils.data_class import ChatData, Message
from langchain.agents.format_scratchpad.openai_tools import (
    format_to_openai_tool_messages,
)
from langchain_core.messages import AIMessage, FunctionMessage, HumanMessage, SystemMessage
from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser
from langchain.prompts import MessagesPlaceholder
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.utilities.tavily_search import TavilySearchAPIWrapper
from langchain_community.tools.tavily_search.tool import TavilySearchResults
from petercat_utils import get_env_variable


TAVILY_API_KEY = get_env_variable("TAVILY_API_KEY")


class AgentBuilder:

    def __init__(
        self,
        chat_model: BaseLLMClient,
        prompt: str,
        tools: Dict[str, Callable],
        enable_tavily: Optional[bool] = True,
    ):
        """
        @class `Builde AgentExecutor based on tools and prompt`
        @param prompt: str
        @param tools: Dict[str, Callable]
        @param enable_tavily: Optional[bool] If set True, enables the Tavily tool
        """
        self.prompt = prompt
        self.tools = tools
        self.enable_tavily = enable_tavily
        self.chat_model = chat_model
        self.agent_executor = self._create_agent_with_tools()

    def init_tavily_tools(self):
        # init Tavily
        search = TavilySearchAPIWrapper()
        tavily_tool = TavilySearchResults(api_wrapper=search)
        return [tavily_tool]

    def _create_agent_with_tools(self) -> AgentExecutor:
        llm = self.chat_model.get_client()

        tools = self.init_tavily_tools() if self.enable_tavily else []

        for tool in self.tools.values():
            tools.append(tool)

        if tools:
            parsed_tools = self.chat_model.get_tools(tools)
            llm = llm.bind_tools(parsed_tools)

        self.prompt = self.get_prompt()
        agent = (
            {
                "input": lambda x: x["input"],
                "agent_scratchpad": lambda x: format_to_openai_tool_messages(
                    x["intermediate_steps"]
                ),
                "chat_history": lambda x: x["chat_history"],
            }
            | self.prompt
            | llm
            | OpenAIToolsAgentOutputParser()
        )

        return AgentExecutor(
            agent=agent,
            tools=tools,
            verbose=True,
            handle_parsing_errors=True,
            max_iterations=5,
        )

    def get_prompt(self):
        return ChatPromptTemplate.from_messages(
            [
                ("system", self.prompt),
                MessagesPlaceholder(variable_name="chat_history"),
                ("user", "{input}"),
                MessagesPlaceholder(variable_name="agent_scratchpad"),
            ]
        )

    def chat_history_transform(self, messages: list[Message]):
        transformed_messages = []
        for message in messages:
            match message.role:
                case "user":
                    transformed_messages.append(HumanMessage(self.chat_model.parse_content(content=message.content)))
                case "assistant":
                    transformed_messages.append(AIMessage(content=message.content))
                case "system":
                    transformed_messages.append(SystemMessage(content=message.content))
                case _:
                    transformed_messages.append(FunctionMessage(content=message.content))
        return transformed_messages

    async def run_stream_chat(self, input_data: ChatData) -> AsyncIterator[str]:
        try:
            messages = input_data.messages
            async for event in self.agent_executor.astream_events(
                {
                    "input": self.chat_model.parse_content(messages[len(messages) - 1].content),
                    "chat_history": self.chat_history_transform(messages),
                },
                version="v1",
            ):
                kind = event["event"]
                if kind == "on_llm_stream" or kind == "on_chat_model_stream":
                    content = event["data"]["chunk"].content
                    if content:
                        json_output = json.dumps(
                            {
                                "id": event["run_id"],
                                "type": "message",
                                "content": content,
                            },
                            ensure_ascii=False,
                        )
                        yield f"data: {json_output}\n\n"
                elif kind == "on_tool_start":
                    children_value = event["data"].get("input", {})
                    json_output = json.dumps(
                        {
                            "id": event["run_id"],
                            "type": "tool",
                            "extra": {
                                "source": f"已调用工具: {event['name']}",
                                "pluginName": "GitHub",
                                "data": json.dumps(children_value, ensure_ascii=False),
                                "status": "loading",
                            },
                        },
                        ensure_ascii=False,
                    )

                    yield f"data: {json_output}\n\n"
                elif kind == "on_tool_end":
                    children_value = event["data"].get("output", {})

                    parsed_children_value = json.loads(children_value)
                    if isinstance(parsed_children_value, dict):
                        template_id = parsed_children_value.get("template_id", None)
                        card_data = parsed_children_value.get("card_data", None)
                    else:
                        template_id = None
                        card_data = None

                    extra_data = {
                        "source": f"已调用工具: {event['name']}",
                        "pluginName": "GitHub",
                        "status": "success",
                    }

                    if template_id is None:
                        extra_data["data"] = children_value
                    else:
                        extra_data.update(
                            {
                                "data": card_data,
                                "template_id": template_id,
                            }
                        )

                    json_output = json.dumps(
                        {
                            "id": event["run_id"],
                            "type": "tool",
                            "extra": extra_data,
                        },
                        ensure_ascii=False,
                    )

                    yield f"data: {json_output}\n\n"
        except Exception as e:
            res = {"status": "error", "message": str(e)}
            yield f"data: {json.dumps(res, ensure_ascii=False)}\n\n"

    async def run_chat(self, input_data: ChatData) -> str:
        try:
            messages = input_data.messages
            return self.agent_executor.invoke(
                {
                    "input": messages[len(messages) - 1].content,
                    "chat_history": self.chat_history_transform(messages),
                },
                return_only_outputs=True,
            )
        except Exception as e:
            print(traceback.format_exc())
            return f"error: {str(e)}\n"
