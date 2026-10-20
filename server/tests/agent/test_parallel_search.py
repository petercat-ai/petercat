"""Exercise search selection and MCP through the real LangChain agent executor."""

import asyncio
import json
from types import SimpleNamespace

import httpx
import pytest
from langchain_core.language_models import BaseChatModel
from langchain_core.messages import AIMessage, ToolMessage
from langchain_core.outputs import ChatGeneration, ChatResult
from langchain_core.utils.function_calling import convert_to_openai_tool
from pydantic import Field, ValidationError

from agent.base import AgentBuilder
from agent.tools import parallel_search
from core.type_class.data_class import ChatData, Message, TextContentBlock


class ScriptedModel(BaseChatModel):
    responses: list[AIMessage]
    seen: list = Field(default_factory=list)

    @property
    def _llm_type(self):
        return "scripted-search-test"

    def bind_tools(self, tools, **kwargs):
        return self

    def _generate(self, messages, stop=None, run_manager=None, **kwargs):
        self.seen.append(messages)
        return ChatResult(generations=[ChatGeneration(message=self.responses.pop(0))])


class ScriptedClient:
    def __init__(self, responses):
        self.model = ScriptedModel(responses=responses)

    def get_client(self):
        return self.model

    def get_tools(self, tools):
        return [convert_to_openai_tool(tool) for tool in tools]

    def parse_content(self, content):
        return [block.model_dump() for block in content]


def tool_call(name="web_search", args=None):
    return AIMessage(content="", tool_calls=[{
        "name": name,
        "args": args or {"objective": "Find PeterCat documentation", "search_queries": ["PeterCat agent documentation"]},
        "id": f"call_{name}",
    }])


def chat_data():
    return ChatData(messages=[Message(role="user", content=[TextContentBlock(type="text", text="Research PeterCat")])])


def builder(responses=None, **kwargs):
    return AgentBuilder(
        chat_model=ScriptedClient(responses or [AIMessage(content="Done")]),
        prompt="Use available web tools for research.", tools={}, **kwargs,
    )


@pytest.fixture(autouse=True)
def isolated_credentials(monkeypatch):
    for key in ("WEB_SEARCH_PROVIDER", "TAVILY_API_KEY", "PARALLEL_API_KEY", "OPENAI_API_KEY"):
        monkeypatch.delenv(key, raising=False)


@pytest.fixture
def mcp_http(monkeypatch):
    state = SimpleNamespace(requests=[], result_error=False, status=200, delay=0, sse=False, missing=False, entered=asyncio.Event())
    client_type = httpx.AsyncClient

    async def respond(request):
        state.requests.append(request)
        if request.method != "POST":
            return httpx.Response(405)
        body = json.loads(request.content)
        if "id" not in body:
            return httpx.Response(202)
        method = body["method"]
        if method == "initialize":
            result = {"protocolVersion": body["params"]["protocolVersion"], "capabilities": {"tools": {}}, "serverInfo": {"name": "fixture", "version": "1"}}
        elif method == "tools/list":
            result = {"tools": [] if state.missing else [{"name": name, "inputSchema": {"type": "object"}} for name in ("web_search", "web_fetch")]}
        elif method == "tools/call":
            state.entered.set()
            await asyncio.sleep(state.delay)
            if state.status != 200:
                return httpx.Response(state.status, json={"error": "fixture transport error"})
            result = {"content": [{"type": "text", "text": "Quota exceeded" if state.result_error else "Source evidence: https://example.org/source"}], "isError": state.result_error}
        else:
            raise AssertionError(f"Unexpected MCP method: {method}")
        response = {"jsonrpc": "2.0", "id": body["id"], "result": result}
        if state.sse:
            return httpx.Response(200, headers={"Content-Type": "text/event-stream"}, content=f"event: message\ndata: {json.dumps(response)}\n\n")
        return httpx.Response(200, json=response)

    def client_factory(**kwargs):
        return client_type(transport=httpx.MockTransport(respond), **kwargs)

    monkeypatch.setattr(parallel_search, "httpx", SimpleNamespace(AsyncClient=client_factory, HTTPError=httpx.HTTPError))
    return state


def calls(state):
    return [json.loads(r.content) for r in state.requests if r.method == "POST" and json.loads(r.content).get("method") == "tools/call"]


@pytest.mark.parametrize("provider,key,enabled,expected", [
    (None, None, True, ["web_search", "web_fetch"]),
    (None, "configured-tavily-key", True, ["tavily_search_results_json"]),
    ("parallel", "configured-tavily-key", True, ["web_search", "web_fetch"]),
    ("tavily", "configured-tavily-key", True, ["tavily_search_results_json"]),
    ("none", None, True, []),
    ("parallel", None, False, []),
    (None, "configured-tavily-key", False, []),
])
def test_provider_selection(monkeypatch, mcp_http, provider, key, enabled, expected):
    if provider is not None:
        monkeypatch.setenv("WEB_SEARCH_PROVIDER", provider)
    if key is not None:
        monkeypatch.setenv("TAVILY_API_KEY", key)
    agent = builder(enable_tavily=enabled)
    assert [tool.name for tool in agent.agent_executor.tools] == expected
    assert not mcp_http.requests  # No request before a model selects a tool.


def test_invalid_and_unconfigured_explicit_provider(monkeypatch, mcp_http):
    monkeypatch.setenv("WEB_SEARCH_PROVIDER", "unknown")
    with pytest.raises(ValueError, match="WEB_SEARCH_PROVIDER"):
        builder()
    monkeypatch.setenv("WEB_SEARCH_PROVIDER", "tavily")
    with pytest.raises(ValidationError):
        builder()
    assert not mcp_http.requests


@pytest.mark.asyncio
@pytest.mark.parametrize("sse", [False, True])
async def test_agent_search_fetch_and_result_consumption(mcp_http, sse):
    mcp_http.sse = sse
    agent = builder([tool_call(), tool_call("web_fetch", {"urls": ["https://example.org/source"]}), AIMessage(content="Answer from source evidence")])
    result = await agent.run_chat(chat_data())
    assert result["output"] == "Answer from source evidence"
    tool_messages = [message for message in agent.chat_model.model.seen[-1] if isinstance(message, ToolMessage)]
    assert len(tool_messages) == 2
    assert all("Source evidence" in message.content for message in tool_messages)
    sent = calls(mcp_http)
    assert [call["params"]["name"] for call in sent] == ["web_search", "web_fetch"]
    assert sent[1]["params"]["arguments"]["urls"] == ["https://example.org/source"]
    for request in mcp_http.requests:
        assert str(request.url) == "https://search.parallel.ai/mcp"
        assert request.headers["user-agent"] == parallel_search.USER_AGENT
        assert "authorization" not in request.headers
    assert all("session_id" not in call["params"]["arguments"] for call in sent)
    assert any(json.loads(r.content).get("method") == "tools/list" for r in mcp_http.requests if r.method == "POST")


@pytest.mark.asyncio
async def test_streaming_agent_results(mcp_http):
    agent = builder([tool_call(), AIMessage(content="Answer from source evidence")])
    events = [event async for event in agent.run_stream_chat(chat_data())]
    outputs = [event["extra"] for event in events if event.get("type") == "tool" and event["extra"]["status"] == "success"]
    assert outputs and "Source evidence" in str(outputs[0]["data"])
    assert any("Source evidence" in str(message.content) for message in agent.chat_model.model.seen[-1] if isinstance(message, ToolMessage))


@pytest.mark.asyncio
@pytest.mark.parametrize("failure", ["quota", "http", "missing"])
async def test_errors_reach_agent_without_provider_fallback(mcp_http, failure):
    mcp_http.result_error = failure == "quota"
    mcp_http.status = 503 if failure == "http" else 200
    mcp_http.missing = failure == "missing"
    agent = builder([tool_call(), AIMessage(content="Search unavailable")])
    result = await agent.run_chat(chat_data())
    assert result["output"] == "Search unavailable"
    message = next(m for m in agent.chat_model.model.seen[-1] if isinstance(m, ToolMessage))
    assert "error" in message.content
    assert len(calls(mcp_http)) == (0 if failure == "missing" else 1)


@pytest.mark.asyncio
async def test_timeout_and_cancellation(mcp_http, monkeypatch):
    mcp_http.delay = 10
    monkeypatch.setattr(parallel_search, "REQUEST_TIMEOUT", 0.05)
    agent = builder([tool_call(), AIMessage(content="Timed out")])
    result = await asyncio.wait_for(agent.run_chat(chat_data()), timeout=2)
    assert result["output"] == "Timed out"
    message = next(m for m in agent.chat_model.model.seen[-1] if isinstance(m, ToolMessage))
    assert "error" in message.content
    monkeypatch.setattr(parallel_search, "REQUEST_TIMEOUT", 30)
    mcp_http.entered.clear()
    task = asyncio.create_task(builder([tool_call()]).run_chat(chat_data()))
    await asyncio.wait_for(mcp_http.entered.wait(), timeout=2)
    task.cancel()
    with pytest.raises(asyncio.CancelledError):
        await task


@pytest.mark.asyncio
async def test_invalid_fetch_url_never_contacts_service(mcp_http):
    agent = builder()
    fetch = next(tool for tool in agent.agent_executor.tools if tool.name == "web_fetch")
    with pytest.raises(ValidationError, match="HTTP or HTTPS"):
        await fetch.ainvoke({"urls": ["file:///etc/passwd"]})
    assert not mcp_http.requests


def test_sync_executor(mcp_http):
    agent = builder([tool_call(), AIMessage(content="Source consumed")])
    result = agent.agent_executor.invoke({"input": "Research PeterCat", "chat_history": []})
    assert result["output"] == "Source consumed"
    assert len(calls(mcp_http)) == 1
