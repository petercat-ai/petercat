import json
from typing import Any

from langchain_community.vectorstores import SupabaseVectorStore
from langchain_openai import OpenAIEmbeddings

from data_class import GitDocConfig, GitIssueConfig, S3Config
from db.supabase.client import get_client
from rag_helper.github_file_loader import GithubFileLoader
from utils.env import get_env_variable

supabase_url = get_env_variable("SUPABASE_URL")
supabase_key = get_env_variable("SUPABASE_SERVICE_KEY")

TABLE_NAME = "rag_docs"
QUERY_NAME = "match_rag_docs"
CHUNK_SIZE = 2000
CHUNK_OVERLAP = 200


def convert_document_to_dict(document):
    return document.page_content,


def init_retriever():
    embeddings = OpenAIEmbeddings()
    vector_store = SupabaseVectorStore(
        embedding=embeddings,
        client=get_client(),
        table_name=TABLE_NAME,
        query_name=QUERY_NAME,
        chunk_size=CHUNK_SIZE,
    )

    return vector_store.as_retriever()


def init_s3_Loader(config: S3Config):
    from langchain_community.document_loaders import S3DirectoryLoader
    loader = S3DirectoryLoader(config.s3_bucket, prefix=config.file_path)
    return loader

# TODO init_github_issue_loader
# def init_github_issue_loader(config: GitIssueConfig):
#     from langchain_community.document_loaders import GitHubIssuesLoader

#     loader = GitHubIssuesLoader(
#         repo=config.repo_name,
#         access_token=ACCESS_TOKEN,
#         page=config.page,
#         per_page=config.per_page,
#         state=config.state
#     )
#     return loader


def init_github_file_loader(config: GitDocConfig):
    loader = GithubFileLoader(
        repo=config.repo_name,
        branch=config.branch,
        file_path=config.file_path,
        file_filter=lambda file_path: file_path.endswith(".md"),
        commit_id=config.commit_id
    )
    return loader


def supabase_embedding(documents, **kwargs: Any):
    from langchain_text_splitters import CharacterTextSplitter

    try:
        text_splitter = CharacterTextSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
        docs = text_splitter.split_documents(documents)
        embeddings = OpenAIEmbeddings()
        vector_store = SupabaseVectorStore.from_documents(
            docs,
            embeddings,
            client=get_client(),
            table_name=TABLE_NAME,
            query_name=QUERY_NAME,
            chunk_size=CHUNK_SIZE,
            **kwargs
        )
        return vector_store
    except Exception as e:
        print(e)
        return None

# TODO this feature is not implemented yet
# def add_knowledge_by_issues(config: GitIssueConfig):
#     try:
#         loader = init_github_issue_loader(config)
#         documents = loader.load()
#         store = supabase_embedding(documents, repo_name=config.repo_name)
#         if (store):
#             return json.dumps({
#                 "success": True,
#                 "message": "Knowledge added successfully!",
#             })
#         else:
#             return json.dumps({
#                 "success": False,
#                 "message": "Knowledge not added!"
#             })
#     except Exception as e:
#         return json.dumps({
#             "success": False,
#             "message": str(e)
#         })


def add_knowledge_by_doc(config: GitDocConfig):
    loader = init_github_file_loader(config)
    documents = loader.load()
    supabase = get_client()
    is_added_query = (
        supabase.table(TABLE_NAME)
        .select("id, repo_name, commit_id, file_path")
        .eq('repo_name', config.repo_name)
        .eq('commit_id', loader.commit_id)
        .eq('file_path', config.file_path)
        .execute()
    )
    if not is_added_query.data:
        is_equal_query = (
            supabase.table(TABLE_NAME)
            .select("*")
            .eq('file_sha', loader.file_sha)
        ).execute()
        if not is_equal_query.data:
            store = supabase_embedding(
                documents,
                repo_name=config.repo_name,
                commit_id=loader.commit_id,
                file_sha=loader.file_sha,
                file_path=config.file_path,
                bot_id=config.bot_id
            )
            return store
        else:
            new_commit_list = [
                {
                    **{k: v for k, v in item.items() if k != "id"},
                    "repo_name": config.repo_name,
                    "commit_id": loader.commit_id,
                    "file_path": config.file_path
                }
                for item in is_equal_query.data
            ]
            insert_result = (
                supabase.table(TABLE_NAME)
                .insert(new_commit_list)
                .execute()
            )
            return insert_result
    else:
        return True


def search_knowledge(query: str):
    retriever = init_retriever()
    docs = retriever.invoke(query)
    documents_as_dicts = [convert_document_to_dict(doc) for doc in docs]
    json_output = json.dumps(documents_as_dicts, ensure_ascii=False)
    return json_output
