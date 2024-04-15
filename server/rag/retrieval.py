import json
import boto3
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.vectorstores import SupabaseVectorStore
from db.supabase.client import get_client
from data_class import S3Config
from uilts.env import get_env_variable
from langchain_community.document_loaders import S3DirectoryLoader


supabase_url = get_env_variable("SUPABASE_URL")
supabase_key = get_env_variable("SUPABASE_SERVICE_KEY")
aws_access_key_id=get_env_variable("AWS_ACCESS_KEY_ID")
aws_secret_access_key=get_env_variable("AWS_SECRET_ACCESS_KEY")

table_name="antd_knowledge"
query_name="match_antd_knowledge"
chunk_size=2000


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


def add_knowledge(config: S3Config):    
    try:
        region_name = "ap-northeast-1"
        session = boto3.session.Session()
        session.client(
            service_name='secretsmanager',
            region_name=region_name
        )
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
