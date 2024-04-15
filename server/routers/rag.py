from fastapi import APIRouter
from rag import retrieval
from data_class import GitRepo

router = APIRouter(
    prefix="/api",
    tags=["rag"],
    responses={404: {"description": "Not found"}},
)


@router.post("/rag/add_knowledge")
def add_knowledge(repo: GitRepo):
    data=retrieval.add_knowledge(repo)
    return data

@router.post("/rag/search_knowledge")
def search_knowledge(query: str):
    data=retrieval.search_knowledge(query)
    return data
