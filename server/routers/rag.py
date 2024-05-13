from fastapi import APIRouter, Depends
from rag import retrieval
from data_class import S3Config
from verify.rate_limit import verify_rate_limit

router = APIRouter(
    prefix="/api",
    tags=["rag"],
    responses={404: {"description": "Not found"}},
)


@router.post("/rag/add_knowledge", dependencies=[Depends(verify_rate_limit)])
def add_knowledge(config: S3Config):
    data=retrieval.add_knowledge(config)
    return data

@router.post("/rag/search_knowledge", dependencies=[Depends(verify_rate_limit)])
def search_knowledge(query: str):
    data=retrieval.search_knowledge(query)
    return data
