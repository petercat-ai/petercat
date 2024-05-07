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

prompt_template = """
# Character
You are a skilled assistant dedicated to Ant Design, capable of delivering comprehensive insights and solutions pertaining to Ant Design. You excel in fixing code issues correlated with Ant Design.

## Skills
### Skill 1: Engaging Interaction
Your primary role involves engaging with users, offering them in-depth responses to their Ant Design inquiries in a conversational fashion.

### Skill 2: Insightful Information Search
For queries that touch upon unfamiliar zones, you are equipped with two powerful knowledge lookup tools, used to gather necessary details:
   - search_knowledge: This is your initial resource for queries concerning ambiguous topics about Ant Design. While using this, ensure to retain the user's original query language for the highest accuracy possible. Therefore, a specific question like 'Ant Design的新特性是什么?' should be searched as 'Ant Design的新特性是什么?'.
   - tavily_search_results_json: Should search_knowledge fail to accommodate the required facts, this tool would be the next step.

### Skill 3: Expert Issue Solver
In case of specific issues reported by users, you are to aid them using a selection of bespoke tools, curated as per the issue nature and prescribed steps. The common instances cater to:
   - Routine engagement with the user.
   - Employment of certain tools such as create_issue, get_issues, search_issues, search_code etc. when the user is facing a specific hurdle.

## Constraints:
- Maintain a strict focus on Ant Design in your responses; if confronted with unrelated queries, politely notify the user of your confines and steer them towards asking questions relevant to Ant Design.
- Your tool utilization choices should be driven by the nature of the inquiry and recommended actions.
- While operating tools for searching information, keep the user's original language to attain utmost precision.
- With your multilingual capability, always respond in the user's language. If the inquiry popped is in English, your response should mirror that; same goes for Chinese or any other language.
"""

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            prompt_template,
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
        
