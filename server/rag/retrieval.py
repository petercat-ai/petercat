import json
from typing import Any, Optional
from langchain_openai import OpenAIEmbeddings
from rag.supabase_vectorstore import SupabaseVectorStore
from db.supabase.client import get_client
from data_class import GitDocConfig, GitIssueConfig, S3Config
from rag.github_file_loader import GithubFileLoader
from uilts.env import get_env_variable


supabase_url = get_env_variable("SUPABASE_URL")
supabase_key = get_env_variable("SUPABASE_SERVICE_KEY")
ACCESS_TOKEN=get_env_variable("GITHUB_TOKEN")


TABLE_NAME="rag_docs"
QUERY_NAME="match_rag_docs"
CHUNK_SIZE=2000
CHUNK_OVERLAP=20

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
     
def init_github_issue_loader(config: GitIssueConfig): 
    from langchain_community.document_loaders import GitHubIssuesLoader
    
    loader = GitHubIssuesLoader(
        repo=config.repo_name,
        access_token=ACCESS_TOKEN,
        page=config.page,
        per_page=config.per_page,
        state=config.state
    )
    return loader
def init_github_file_loader(config: GitDocConfig): 
    loader = GithubFileLoader(
        repo=config.repo_name,
        access_token=ACCESS_TOKEN,
        github_api_url="https://api.github.com",
        branch=config.branch,
        file_path=config.file_path,
        file_filter=lambda file_path: file_path.endswith(".md")
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
   

def add_knowledge_by_issues(config: GitIssueConfig, ):    
    try:
        loader = init_github_issue_loader(config)
        documents = loader.load()
        store = supabase_embedding(documents, repo_name=config.repo_name)
        if(store):
            return json.dumps({
                "success": True,
                "message": "Knowledge added successfully!",
            }) 
        else:
            return json.dumps({
                "success": False,
                "message": "Knowledge not added!"
            })
    except Exception as e:
        return json.dumps({
            "success": False,
            "message": str(e)
        })
   
def add_knowledge_by_doc(config: GitDocConfig):    
    try:
        loader = init_github_file_loader(config)
        documents = loader.load()
        store = supabase_embedding(documents, repo_name=config.repo_name, commit_id=config.commit_id, commit_sha=config.commit_sha)
        if(store):
            return json.dumps({
                "success": True,
                "message": "Knowledge added successfully!",
            }) 
        else:
            return json.dumps({
                "success": False,
                "message": "Knowledge not added!"
            })

    except Exception as e:
        return json.dumps({
            "success": False,
            "message": str(e)
        })
   
def search_knowledge(query: str):
    retriever = init_retriever()
    docs = retriever.invoke(query)
    documents_as_dicts = [convert_document_to_dict(doc) for doc in docs]
    json_output = json.dumps(documents_as_dicts, ensure_ascii=False)
    return json_output
