from fastapi import APIRouter
from rag import retrieval
from data_class import S3Config

router = APIRouter(
    prefix="/api",
    tags=["rag"],
    responses={404: {"description": "Not found"}},
)


@router.post("/rag/add_knowledge")
def add_knowledge(config: S3Config):
    data=retrieval.add_knowledge(config)
    return data

@router.post("/rag/search_knowledge")
def search_knowledge(query: str):
    data=retrieval.search_knowledge(query)
    return data
