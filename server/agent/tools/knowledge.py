from langchain.tools import tool
from petercat_utils import retrieval


def factory(repo_name: str):
    repo_name = repo_name

    @tool(parse_docstring=True)
    def search_knowledge(
        query: str,
    ) -> str:
        """Search for information based on the query.  When use this tool, do not translate the search query. Use the original query language to search. eg: When user's question is 'Ant Design 有哪些新特性?', the query should be 'Ant Design 有哪些新特性?'.

        Args:
            query: The user's question.
        """
        try:
            return retrieval.search_knowledge(query, repo_name)
        except Exception as e:
            print(f"An error occurred: {e}")
            return None

    return search_knowledge
