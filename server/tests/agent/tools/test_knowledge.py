import json
from httpx import ReadTimeout
import pytest
from unittest.mock import patch, AsyncMock
from server.agent.tools.knowledge import factory


@pytest.mark.asyncio
async def test_search_knowledge_success():
    bot_id = "test_bot_id"
    query = "What are the new features of Ant Design?"
    expected_response = json.dumps(["Feature 1", "Feature 2"], ensure_ascii=False)

    search_knowledge = factory(bot_id)

    with patch(
        "server.agent.tools.knowledge.get_bot_by_id"
    ) as mock_get_bot_by_id, patch(
        "server.agent.tools.knowledge.APIClient"
    ) as mock_APIClient:

        mock_get_bot_by_id.return_value.repo_name = "test_repo"
        mock_api_client_instance = mock_APIClient.return_value
        mock_api_client_instance.retrieval.retrieve_space_content = AsyncMock(
            return_value=[
                type("Chunk", (object,), {"context": "Feature 1"}),
                type("Chunk", (object,), {"context": "Feature 2"}),
            ]
        )

        response = await search_knowledge.arun(query)
        assert response == expected_response


@pytest.mark.asyncio
async def test_search_knowledge_timeout():
    bot_id = "test_bot_id"
    query = "What are the new features of Ant Design?"

    search_knowledge = factory(bot_id)

    with patch(
        "server.agent.tools.knowledge.get_bot_by_id"
    ) as mock_get_bot_by_id, patch(
        "server.agent.tools.knowledge.APIClient"
    ) as mock_APIClient:

        mock_get_bot_by_id.return_value.repo_name = "test_repo"
        mock_api_client_instance = mock_APIClient.return_value
        mock_api_client_instance.retrieval.retrieve_space_content = AsyncMock(
            side_effect=ReadTimeout
        )

        response = await search_knowledge.arun(query)
        assert response is None


@pytest.mark.asyncio
async def test_search_knowledge_exception():
    bot_id = "test_bot_id"
    query = "What are the new features of Ant Design?"

    search_knowledge = factory(bot_id)

    with patch(
        "server.agent.tools.knowledge.get_bot_by_id"
    ) as mock_get_bot_by_id, patch(
        "server.agent.tools.knowledge.APIClient"
    ) as mock_APIClient:

        mock_get_bot_by_id.return_value.repo_name = "test_repo"
        mock_api_client_instance = mock_APIClient.return_value
        mock_api_client_instance.retrieval.retrieve_space_content = AsyncMock(
            side_effect=Exception("Test Exception")
        )

        response = await search_knowledge.arun(query)
        assert response is None
