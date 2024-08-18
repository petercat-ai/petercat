import json
from typing import Optional

from fastapi import APIRouter, Depends
from verify.rate_limit import verify_rate_limit

from petercat_utils.data_class import RAGGitDocConfig, RAGGitIssueConfig, TaskType
from petercat_utils.rag_helper import retrieval, task, issue_retrieval, git_doc_task, git_issue_task

router = APIRouter(
    prefix="/api",
    tags=["rag"],
    responses={404: {"description": "Not found"}},
)


@router.post("/rag/add_knowledge_by_doc", dependencies=[Depends(verify_rate_limit)])
def add_knowledge_by_doc(config: RAGGitDocConfig):
    try:
        result = retrieval.add_knowledge_by_doc(config)
        if result:
            return json.dumps(
                {
                    "success": True,
                    "message": "Knowledge added successfully!",
                }
            )
        else:
            return json.dumps({"success": False, "message": "Knowledge not added!"})
    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})


@router.post("/rag/add_knowledge_by_issue", dependencies=[Depends(verify_rate_limit)])
def add_knowledge_by_issue(config: RAGGitIssueConfig):
    try:
        result = issue_retrieval.add_knowledge_by_issue(config)
        if result:
            return json.dumps(
                {
                    "success": True,
                    "message": "Issue added successfully!",
                }
            )
        else:
            return json.dumps({"success": False, "message": "Issue not added!"})
    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})


@router.post("/rag/search_knowledge", dependencies=[Depends(verify_rate_limit)])
def search_knowledge(query: str, bot_id: str, filter: dict = {}):
    data = retrieval.search_knowledge(query, bot_id, filter)
    return data


@router.post("/rag/add_git_doc_task", dependencies=[Depends(verify_rate_limit)])
def add_git_doc_task(config: RAGGitDocConfig):
    try:
        data = git_doc_task.add_rag_git_doc_task(config)
        return data
    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})

@router.post("/rag/add_git_issue_task", dependencies=[Depends(verify_rate_limit)])
def add_git_issue_task(config: RAGGitIssueConfig):
    try:
        data = git_issue_task.add_rag_git_issue_task(config)
        return data
    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})


@router.post("/rag/trigger_task", dependencies=[Depends(verify_rate_limit)])
def trigger_task(task_type: TaskType, task_id: Optional[str] = None):
    try:
        task.trigger_task(task_type, task_id)
    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})


@router.get("/rag/chunk/list", dependencies=[Depends(verify_rate_limit)])
def get_chunk_list(bot_id: str = None, page_size: int = 10, page_number: int = 1):
    try:
        return retrieval.get_chunk_list(bot_id, page_size, page_number)
    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})


@router.get("/rag/task/latest", dependencies=[Depends(verify_rate_limit)])
def get_rag_task(bot_id: str):
    try:
        return task.get_latest_task_by_bot_id(bot_id)
    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})
