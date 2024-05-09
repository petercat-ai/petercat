import json
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from db.supabase.client import get_client
from data_class import S3Config
from uilts.env import get_env_variable

supabase_url = get_env_variable("SUPABASE_URL")
supabase_key = get_env_variable("SUPABASE_SERVICE_KEY")


table_name="antd_knowledge"
query_name="match_antd_knowledge"
chunk_size=2000


def convert_document_to_dict(document):
   return document.page_content,


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


def add_knowledge(config: S3Config):    
    from langchain_community.document_loaders import S3DirectoryLoader
    from langchain_text_splitters import CharacterTextSplitter

    try:
        loader = S3DirectoryLoader(config.s3_bucket, prefix=config.file_path)
        documents = loader.load()
        text_splitter = CharacterTextSplitter(chunk_size=2000, chunk_overlap=0)
        docs = text_splitter.split_documents(documents)
        embeddings = OpenAIEmbeddings()
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
            "message": "Knowledge added successfully!",
            "docs_len": len(documents)
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
