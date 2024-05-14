from fastapi import APIRouter, Depends
from rag import retrieval
from data_class import GitDocConfig, GitIssueConfig
from verify.rate_limit import verify_rate_limit

router = APIRouter(
    prefix="/api",
    tags=["rag"],
    responses={404: {"description": "Not found"}},
)


@router.post("/rag/add_knowledge_by_doc", dependencies=[Depends(verify_rate_limit)])
def add_knowledge_by_doc(config: GitDocConfig):
    data=retrieval.add_knowledge_by_doc(config)
    return data

@router.post("/rag/add_knowledge_by_issues", dependencies=[Depends(verify_rate_limit)])
def add_knowledge_by_issues(config: GitIssueConfig):
    data=retrieval.add_knowledge_by_issues(config)
    return data

@router.post("/rag/search_knowledge", dependencies=[Depends(verify_rate_limit)])
def search_knowledge(query: str):
    data=retrieval.search_knowledge(query)
    return data
