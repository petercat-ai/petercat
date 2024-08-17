from typing import Any

from github import Github, IssueComment
from github.Issue import Issue
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
from petercat_utils import get_client
from petercat_utils.data_class import RAGGitIssueConfig

g = Github()

TABLE_NAME = "rag_issues"
QUERY_NAME = "match_rag_issues"
CHUNK_SIZE = 2000
CHUNK_OVERLAP = 200

reaction_scores_map = {
    '+1': 1,
    '-1': -1,
    'confused': -0.5,
    'eyes': 0.5,
    'heart': 2,
    'hooray': 1.5,
    'laugh': 1,
    'rocket': 1,
}


def supabase_embedding(documents, **kwargs: Any):
    from langchain_text_splitters import CharacterTextSplitter

    try:
        text_splitter = CharacterTextSplitter(
            chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP
        )
        docs = text_splitter.split_documents(documents)
        embeddings = OpenAIEmbeddings()
        vector_store = SupabaseVectorStore.from_documents(
            docs,
            embeddings,
            client=get_client(),
            table_name=TABLE_NAME,
            query_name=QUERY_NAME,
            chunk_size=CHUNK_SIZE,
            **kwargs,
        )
        return vector_store
    except Exception as e:
        print(e)
        return None


def get_reactions_score(comment: IssueComment):
    reactions = comment.reactions
    score = 0
    for key in reaction_scores_map:
        score += reactions[key]
    return score


def get_issue_document_list(issue: Issue):
    all_comments = sorted([{
        "id": comment.id,
        "url": comment.url,
        "html_url": comment.html_url,
        "content": comment.body,
        "reaction_score": get_reactions_score(comment)
    } for comment in issue.get_comments()],
        key=lambda x: x['reaction_score'],
        reverse=True)
    document_list = [Document(page_content=comment["content"],
                              metadata={key: value for key, value in comment.items() if key != "content"}
                              ) for
                     comment in all_comments if comment['reaction_score'] > 0]
    return document_list


def add_knowledge_by_issue(config: RAGGitIssueConfig):
    supabase = get_client()
    is_added_query = (
        supabase.table(TABLE_NAME)
        .select("id, repo_name, issue_id, bot_id")
        .eq("repo_name", config.repo_name)
        .eq("issue_id", config.issue_id)
        .eq("bot_id", config.bot_id)
        .eq("comment_id", None)
        .execute()
    )

    if not is_added_query.data:
        issue = g.get_repo(config.repo_name).get_issue(int(config.issue_id))
        document_list = get_issue_document_list(issue)

        issue_store = supabase_embedding(
            documents=[Document(page_content=issue.body,
                                metadata={"id": config.issue_id, "url": issue.url, "html_url": issue.html_url})],
            repo_name=config.repo_name,
            issue_id=config.issue_id,
            bot_id=config.bot_id,
        )
        comment_stores = [
            supabase_embedding(
                documents=[document],
                repo_name=config.repo_name,
                issue_id=config.issue_id,
                bot_id=config.bot_id,
                comment_id=document.metadata["id"]
            )
            for document in document_list
        ]
        return issue_store + comment_stores
    else:
        return True
