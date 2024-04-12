import os
import json
from langchain_community.document_loaders import TextLoader
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.vectorstores import SupabaseVectorStore
from supabase.client import Client, create_client
from uilts.env import get_env_variable

supabase_url = get_env_variable("SUPABASE_URL")
supabase_key = get_env_variable("SUPABASE_SERVICE_KEY")
table_name="antd_knowledge"
query_name="match_antd_knowledge"
chunk_size=500

supabase: Client = create_client(supabase_url, supabase_key)

def convert_document_to_dict(document):
    return {
        'page_content': document.page_content,
        'metadata': document.metadata,
    }


def init_retriever():
    embeddings = OpenAIEmbeddings()
    db = SupabaseVectorStore(
      embedding=embeddings,
      client=supabase,
      table_name=table_name,
      query_name=query_name,
      chunk_size=chunk_size,
    )

    return db.as_retriever()

def add_knowledge():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    target_file_path = os.path.join(current_dir, "../docs/test.md")
    loader = TextLoader(target_file_path)
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    docs = text_splitter.split_documents(documents)
    embeddings = OpenAIEmbeddings()

    try:
      SupabaseVectorStore.from_documents(
        docs,
        embeddings,
        client=supabase,
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
