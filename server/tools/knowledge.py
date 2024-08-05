from langchain.tools import tool
from rag_helper import retrieval


@tool
def search_knowledge(
    query: str,
    bot_id: str
):
    """
    Search for information based on the query.  When use this tool, do not translate the search query. Use the original query language to search. eg: When user's question is 'Ant Design 有哪些新特性?', the query should be 'Ant Design 有哪些新特性?'.

    :param query: The user's question.
    :param bot_id: The bot's unique id.
    """
    try:
        return retrieval.search_knowledge(query, bot_id)
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
