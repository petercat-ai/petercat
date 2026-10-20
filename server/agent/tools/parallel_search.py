"""Anonymous web search and page extraction through Parallel Search MCP."""

import asyncio
from urllib.parse import urlsplit

import anyio
import httpx
from langchain_core.tools import StructuredTool
from mcp import ClientSession, McpError
from mcp.client.streamable_http import streamable_http_client
from pydantic import BaseModel, Field, field_validator

MCP_URL = "https://search.parallel.ai/mcp"
USER_AGENT = "PeterCat (https://github.com/afx-team/petercat)"
REQUEST_TIMEOUT = 30


class SearchInput(BaseModel):
    objective: str = Field(min_length=1, description="The information to find.")
    search_queries: list[str] = Field(min_length=1, description="Related keyword queries.")


class FetchInput(BaseModel):
    urls: list[str] = Field(min_length=1, max_length=20)
    objective: str | None = Field(default=None, max_length=200)

    @field_validator("urls")
    @classmethod
    def http_urls(cls, urls):
        for url in urls:
            parsed = urlsplit(url)
            if parsed.scheme not in ("http", "https") or not parsed.hostname:
                raise ValueError("Page URLs must use HTTP or HTTPS")
        return urls


async def _call_tool(name: str, arguments: dict) -> dict:
    # ChatData has no durable conversation identity. Leave the optional MCP
    # session_id unset rather than tying it to this connection or agent instance.
    cancelled = None
    try:
        # Level cancellation also bounds the SDK's stateful session cleanup.
        with anyio.fail_after(REQUEST_TIMEOUT) as deadline:
            async with (
                httpx.AsyncClient(
                    headers={"User-Agent": USER_AGENT},
                    timeout=REQUEST_TIMEOUT,
                    follow_redirects=True,
                ) as http_client,
                streamable_http_client(MCP_URL, http_client=http_client) as streams,
                ClientSession(streams[0], streams[1]) as session,
            ):
                try:
                    await session.initialize()
                    available = await session.list_tools()
                    if name not in {tool.name for tool in available.tools}:
                        return {"error": f"Parallel does not offer {name}."}
                    result = await session.call_tool(name, arguments)
                    content = [block.model_dump(mode="json") for block in result.content]
                    return {"error" if result.isError else "content": content}
                except asyncio.CancelledError as exc:
                    cancelled = exc
                    deadline.cancel()
                    raise
    except TimeoutError:
        return {"error": "Parallel web search timed out. Try again later."}
    except (httpx.HTTPError, McpError, ExceptionGroup, OSError):
        # Do not switch providers after a failure, or expose transport internals.
        # CancelledError is a BaseException and propagates to the agent caller.
        return {"error": "Parallel web search is unavailable. Try again later."}
    if cancelled is not None:
        raise cancelled


async def web_search(objective: str, search_queries: list[str]) -> dict:
    return await _call_tool("web_search", {"objective": objective, "search_queries": search_queries})


async def web_fetch(urls: list[str], objective: str | None = None) -> dict:
    return await _call_tool("web_fetch", {"urls": urls, "objective": objective})


def create_parallel_tools():
    """Construct tools without contacting the service until the agent uses them."""
    return [
        StructuredTool.from_function(
            func=lambda **kwargs: asyncio.run(web_search(**kwargs)),
            coroutine=web_search,
            name="web_search",
            description="Search the web for current information and source URLs. Use knowledge search first when available.",
            args_schema=SearchInput,
        ),
        StructuredTool.from_function(
            func=lambda **kwargs: asyncio.run(web_fetch(**kwargs)),
            coroutine=web_fetch,
            name="web_fetch",
            description="Read relevant content from HTTP or HTTPS source URLs after searching the web.",
            args_schema=FetchInput,
        ),
    ]
