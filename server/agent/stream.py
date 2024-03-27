from typing import AsyncIterator
from langchain.agents import AgentExecutor
from data_class import ChatData, Message
from langchain.agents.format_scratchpad.openai_tools import (
    format_to_openai_tool_messages,
)
from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser
from langchain.prompts import MessagesPlaceholder
from langchain_core.utils.function_calling import convert_to_openai_tool
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from tools import issue
from langchain_core.messages import AIMessage, FunctionMessage, HumanMessage


prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are very powerful assistant. When you are asked questions, you can determine whether to use the corresponding tools based on the descriptions of the actions. There may be two situations:"
            "1. Talk with the user as normal. "
            "2. If they ask you about issues, use a tool",
        ),
        MessagesPlaceholder(variable_name="chat_history"),
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
            tools=[convert_to_openai_tool(tool) for tool in tools]
        )
    else:
        llm_with_tools = llm

    agent = (
        {
            "input": lambda x: x["input"],
            "agent_scratchpad": lambda x: format_to_openai_tool_messages(
                x["intermediate_steps"]
            ),
            "chat_history": lambda x: x["chat_history"],
        }
        | prompt
        | llm_with_tools
        | OpenAIToolsAgentOutputParser()
    )
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True).with_config(
        {"run_name": "agent"}
    )
    return agent_executor


def chat_history_transform(messages: list[Message]):
    transformed_messages = []
    for message in messages:
        print('meaage', message)
        if message.role == "user":
            transformed_messages.append(HumanMessage(content=message.content))
        elif message.role == "assistant":
           transformed_messages.append(AIMessage(content=message.content))
        else:
            transformed_messages.append(FunctionMessage(content=message.content))
    return transformed_messages


async def agent_chat(input_data: ChatData, openai_api_key) -> AsyncIterator[str]:
    try:
        messages = input_data.messages
        agent_executor = _create_agent_with_tools(openai_api_key)
        print(chat_history_transform(messages))
        async for event in agent_executor.astream_events(
            {
                "input": messages[len(messages) - 1].content,
                "chat_history": chat_history_transform(messages),
            },
            version="v1",
        ):
            kind = event["event"]
            if kind == "on_chain_start":
                if (
                    event["name"] == "agent"
                ): 
                    print(
                        f"Starting agent: {event['name']} "
                        f"with input: {event['data'].get('input')}"
                    )
            elif kind == "on_chain_end":
                if (
                    event["name"] == "agent"
                ): 
                    print (
                        f"Done agent: {event['name']} "
                        f"with output: {event['data'].get('output')['output']}"
                    )
            if kind == "on_chat_model_stream":
                content = event["data"]["chunk"].content
                if content:
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
        
