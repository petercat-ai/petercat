import os
import json
from langchain_community.document_loaders import TextLoader
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.vectorstores import SupabaseVectorStore
from db.supabase.client import get_client
from data_class import GitRepo
from uilts.env import get_env_variable
from langchain_community.document_loaders import GitLoader
from github import Github, Repository

supabase_url = get_env_variable("SUPABASE_URL")
supabase_key = get_env_variable("SUPABASE_SERVICE_KEY")
github_token = get_env_variable("GITHUB_TOKEN")
table_name="antd_knowledge"
query_name="match_antd_knowledge"
chunk_size=500
g = Github()

def convert_document_to_dict(document):
    return {
        'page_content': document.page_content,
        'metadata': document.metadata,
    }


def init_retriever():
    embeddings = OpenAIEmbeddings()
    db = SupabaseVectorStore(
      embedding=embeddings,
      client=get_client(),
      table_name=table_name,
      query_name=query_name,
      chunk_size=chunk_size,
    )

    return db.as_retriever()

def get_repo_info(repo_name: str):
    try:
        repo = g.get_repo(repo_name)
        return repo
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def add_knowledge(repo: GitRepo):
    repo_info: Repository = get_repo_info(repo.repo_name)
    if not repo_info:
      return json.dumps({
          "success": False,
          "message": "Invalid repository name!"
    })
    loader=GitLoader(
      clone_url=repo_info.html_url,
      repo_path=repo.path,
      branch=repo.branch  or repo_info.default_branch,
    )
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    docs = text_splitter.split_documents(documents)
    embeddings = OpenAIEmbeddings()

    try:
      SupabaseVectorStore.from_documents(
        docs,
        embeddings,
        client=get_client(),
        table_name=table_name,
        query_name=query_name,
        chunk_size=chunk_size,
      )
      return json.dumps({
        "success": True,
        "message": "Knowledge added successfully!"
      })
    except Exception as e:
      return json.dumps({
        "success": False,
        "message": str(e)
      })
   
def search_knowledge(query: str):
    retriever = init_retriever()
    docs = retriever.get_relevant_documents(query)
    documents_as_dicts = [convert_document_to_dict(doc) for doc in docs]
    json_output = json.dumps(documents_as_dicts, ensure_ascii=False)
    return json_output
