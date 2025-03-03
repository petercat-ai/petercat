import json
from httpx import ReadTimeout
from whiskerrag_client import APIClient
from whiskerrag_types.model import RetrievalBySpaceRequest, EmbeddingModelEnum
from agent.bot.get_bot import get_bot_by_id
from langchain.tools import tool
from utils.env import get_env_variable


def factory(bot_id: str):
    bot_id = bot_id

    @tool(parse_docstring=True)
    async def search_knowledge(
        query: str,
    ) -> str:
        """Search for information based on the query.  When use this tool, do not translate the search query. Use the original query language to search. eg: When user's question is 'Ant Design 有哪些新特性?', the query should be 'Ant Design 有哪些新特性?'.

        Args:
            query: The user's question.
        """
        try:
            bot = get_bot_by_id(bot_id)
            repo_name = bot.repo_name if bot.repo_name else ""
            api_client = APIClient(
                base_url=get_env_variable("WHISKER_API_URL"),
                token=get_env_variable("WHISKER_API_KEY"),
                timeout=30,
            )
            retrieval_res = await api_client.retrieval.retrieve_space_content(
                RetrievalBySpaceRequest(
                    space_id_list=[bot_id, repo_name],
                    question=query,
                    embedding_model_name=EmbeddingModelEnum.OPENAI,
                    similarity_threshold=0.6,
                    top=30,
                    metadata_filter={},
                )
            )
            text = json.dumps(
                [chunk.context for chunk in retrieval_res if retrieval_res],
                ensure_ascii=False,
            )
            return text
        except ReadTimeout:
            print("TimeoutError: The request timed out.")
            return None
        except Exception as e:
            print(f"An error occurred: {e}")
            return None

    return search_knowledge
