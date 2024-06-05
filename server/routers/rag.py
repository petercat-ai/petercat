import json
from typing import Optional

from fastapi import APIRouter, Depends

from data_class import GitDocConfig, GitIssueConfig
from rag_helper import retrieval, task
from verify.rate_limit import verify_rate_limit

router = APIRouter(
    prefix="/api",
    tags=["rag"],
    responses={404: {"description": "Not found"}},
)


@router.post("/rag/add_knowledge_by_doc", dependencies=[Depends(verify_rate_limit)])
def add_knowledge_by_doc(config: GitDocConfig):
    try:
        result = retrieval.add_knowledge_by_doc(config)
        if (result):
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


@router.post("/rag/add_knowledge_by_issues", dependencies=[Depends(verify_rate_limit)])
def add_knowledge_by_issues(config: GitIssueConfig):
    data = retrieval.add_knowledge_by_issues(config)
    return data


@router.post("/rag/search_knowledge", dependencies=[Depends(verify_rate_limit)])
def search_knowledge(query: str):
    data = retrieval.search_knowledge(query)
    return data


@router.post("/rag/add_task", dependencies=[Depends(verify_rate_limit)])
def add_task(config: GitDocConfig):
    try:
        data = task.add_task(config)
        return data
    except Exception as e:
        return json.dumps({
            "success": False,
            "message": str(e)
        })


@router.post("/rag/trigger_task", dependencies=[Depends(verify_rate_limit)])
def trigger_task(task_id: Optional[str] = None):
    data = task.trigger_task(task_id)
    return data
