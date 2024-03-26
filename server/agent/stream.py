from typing import Any, AsyncIterator, List, Literal
from langchain.agents import AgentExecutor, tool
from langchain.agents.format_scratchpad.openai_tools import (
    format_to_openai_tool_messages,
)
from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser
from langchain.prompts import MessagesPlaceholder
from langchain_community.tools.convert_to_openai import format_tool_to_openai_tool
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from tools import issue


prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are very powerful assistant. When you are asked questions, you can determine whether to use the corresponding tools based on the descriptions of the actions. There may be two situations:"
            "1. Talk with the user as normal. "
            "2. If they ask you about issues, use a tool",
        ),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
)



TOOL_MAPPING = {
    "create_issue": issue.create_issue,
    "get_issues_list": issue.get_issues_list,
    "get_issues_by_number": issue.get_issues_by_number
}
TOOLS = ["create_issue", "get_issues_list", "get_issues_by_number"]


def _create_agent_with_tools(openai_api_key: str ) -> AgentExecutor:
    openai_api_key=openai_api_key
    llm = ChatOpenAI(model="gpt-4", temperature=0.2, streaming=True)
    tools = []

    for requested_tool in TOOLS:
        if requested_tool not in TOOL_MAPPING:
            raise ValueError(f"Unknown tool: {requested_tool}")
        tools.append(TOOL_MAPPING[requested_tool])

    if tools:
        llm_with_tools = llm.bind(
            tools=[format_tool_to_openai_tool(tool) for tool in tools]
        )
    else:
        llm_with_tools = llm

    agent = (
        {
            "input": lambda x: x["input"],
            "agent_scratchpad": lambda x: format_to_openai_tool_messages(
                x["intermediate_steps"]
            ),
        }
        | prompt
        | llm_with_tools
        | OpenAIToolsAgentOutputParser()
    )
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True).with_config(
        {"run_name": "agent"}
    )
    return agent_executor



async def agent_chat(input_data: str, openai_api_key) -> AsyncIterator[str]:
    try:
        agent_executor = _create_agent_with_tools(openai_api_key)
        async for event in agent_executor.astream_events(
            {
                "input": input_data,
            },
            version="v1",
        ):
            kind = event["event"]
            if kind == "on_chain_start":
                if (
                    event["name"] == "agent"
                ):  # matches `.with_config({"run_name": "Agent"})` in agent_executor
                    yield "\n"
                    yield (
                        f"Starting agent: {event['name']} "
                        f"with input: {event['data'].get('input')}"
                    )
                    yield "\n"
            elif kind == "on_chain_end":
                if (
                    event["name"] == "agent"
                ):  # matches `.with_config({"run_name": "Agent"})` in agent_executor
                    yield "\n"
                    yield (
                        f"Done agent: {event['name']} "
                        f"with output: {event['data'].get('output')['output']}"
                    )
                    yield "\n"
            if kind == "on_chat_model_stream":
                content = event["data"]["chunk"].content
                if content:
                    # Empty content in the context of OpenAI means
                    # that the model is asking for a tool to be invoked.
                    # So we only print non-empty content
                    yield f"{content}"
            elif kind == "on_tool_start":
                yield "\n"
                yield (
                    f"Starting tool: {event['name']} "
                    f"with inputs: {event['data'].get('input')}"
                )
                yield "\n"
            elif kind == "on_tool_end":
                yield "\n"
                yield (
                    f"Done tool: {event['name']} "
                    f"with output: {event['data'].get('output')}"
                )
                yield "\n"

        
    except Exception as e:
        yield f"data: {str(e)}\n\n"
        
