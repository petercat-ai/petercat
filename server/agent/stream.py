import json
import uuid
from typing import AsyncIterator
from langchain.agents import AgentExecutor
from data_class import ChatData, Message
from langchain.agents.format_scratchpad.openai_tools import (
    format_to_openai_tool_messages,
)
from langchain_core.messages import AIMessage, FunctionMessage, HumanMessage
from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser
from langchain.prompts import PromptTemplate, MessagesPlaceholder
from langchain_core.utils.function_calling import convert_to_openai_tool
from langchain_core.prompts import ChatPromptTemplate
from langchain.utilities.tavily_search import TavilySearchAPIWrapper
from langchain.tools.tavily_search import TavilySearchResults
from langchain_openai import ChatOpenAI
from uilts.env import get_env_variable
from tools import issue, sourcecode, knowledge
TAVILY_API_KEY =  get_env_variable("TAVILY_API_KEY")

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Character: Ant Design Bot"
            "You are a question-and-answer robot specifically dedicated to providing solutions and information  for Ant Design. You are well-versed in Ant Design-related knowledge and capable of assisting in fixing code issues related to it."
            "Skill 1: Normal Conversation"
            "In most cases, you will have ordinary conversations with users, answering questions about Ant Design."
            "Skill 2: Knowledge Search"
            "When users ask about issues or something you don't know, you will choose to use the appropriate search tools for handling based on the description of actions. There are two search tools you can use:"
            "1. search_knowledge: You can use it first to search knowledge that you do not sure about Ant Design. When use this tool, do not translate the search query. Use the original query language to search. eg: When user's question is 'Ant Design 有哪些新特性?', the query should be 'Ant Design 有哪些新特性?'."
            "2. tavily_search_results_json: You can use this tool to search information that you can't find by using search_knowledge."
            "Skill 3: Issue Handling"
            "When users ask about issues, you will choose to use the appropriate tools for handling based on the description of actions. There could be two scenarios:"
            "1. Talk with the user as normal. "
            "2. If they ask you about issues, use a tool like create_issue, get_issues, search_issues, search_code, etc. to help them."
            "3. If they ask you about issues, use tools like create_issue, get_issues, search_issues, search_code, etc. to help them."
            "Constraints:"
            "Only answer questions related to Ant Design; if users pose unrelated questions, you need to inform the user that you cannot answer and guide them to ask questions related to Ant Design."
            "Decide whether to use relevant tools for handling based on the nature of the question and the description of actions."
            "You must answer questions in the language the user inputs. You are programmed with the ability to recognize multiple languages, allowing you to understand and respond in the same language used by the user. If a user poses a question in English, you should answer in English; if a user communicates in Chinese, you should respond in Chinese."
        ),
        MessagesPlaceholder(variable_name="chat_history"),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
)

TOOL_MAPPING = {
    "search_knowledge": knowledge.search_knowledge,
    "create_issue": issue.create_issue,
    "get_issues": issue.get_issues,
    "search_issues": issue.search_issues,
    "search_code": sourcecode.search_code,
}
TOOLS = ["search_knowledge", "create_issue", "get_issues", "search_issues",  "search_code"]

def init_default_tools():
    # init Tavily 
    search = TavilySearchAPIWrapper()
    tavily_tool = TavilySearchResults(api_wrapper=search)
    
    return [tavily_tool]
    

def _create_agent_with_tools(open_api_key: str) -> AgentExecutor:
    llm = ChatOpenAI(model="gpt-4-1106-preview", temperature=0.2, streaming=True, max_tokens=1500, openai_api_key=open_api_key)
   
   
    tools = init_default_tools();

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
  
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, handle_parsing_errors=True,
max_iterations = 5)
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


async def agent_chat(input_data: ChatData, open_api_key: str) -> AsyncIterator[str]:
    try:
        messages = input_data.messages
        agent_executor = _create_agent_with_tools(open_api_key)
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
                uid =  str(uuid.uuid4())
                content = event["data"]["chunk"].content
                if content:
                    yield f"{content}"
            elif kind == "on_tool_start":
                children_value = event["data"].get("input", {})
                json_output = json.dumps({
                    "type": "tool",
                    "id": uid,
                    "extra": {
                        "source": f"已调用工具: {event['name']}",
                        "pluginName": "GitHub",
                        "data": json.dumps(children_value, ensure_ascii=False),
                        "status": "loading"
                    }
                }, ensure_ascii=False)
                yield f"<TOOL>{json_output}\n"
            elif kind == "on_tool_end":
                children_value = event["data"].get("output", {})
                json_output = json.dumps({
                    "type": "tool",
                    "id": uid,
                    "extra": {
                        "source": f"已调用工具: {event['name']}",
                        "pluginName": "GitHub",
                        "data": children_value,
                        "status": "success"
                    },
                }, ensure_ascii=False)
                yield f"<TOOL>{json_output}\n<ANSWER>"
    except Exception as e:
        yield f"data: {str(e)}\n"
        
