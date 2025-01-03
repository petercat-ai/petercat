import json
from typing import Annotated, Optional
from pydantic import BaseModel

from auth.get_user_info import get_user_id
from fastapi import APIRouter, Depends
from petercat_utils.db.client.supabase import get_client

from petercat_utils.data_class import (
    RAGGitDocConfig,
    RAGGitIssueConfig,
    TaskType,
)
from petercat_utils.rag_helper import (
    retrieval,
    task,
    issue_retrieval,
    git_doc_task,
    git_issue_task,
)

from auth.rate_limit import verify_rate_limit


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
def search_knowledge(query: str, repo_name: str, filter: dict = {}):
    data = retrieval.search_knowledge(query, repo_name, filter)
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
def get_chunk_list(repo_name: str = None, page_size: int = 10, page_number: int = 1):
    try:
        return retrieval.get_chunk_list(repo_name, page_size, page_number)
    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})


@router.get("/rag/task/latest", dependencies=[Depends(verify_rate_limit)])
def get_rag_task(repo_name: str):
    # TODO: Think about hot to get correct when reload knowledge task was triggered
    try:
        supabase = get_client()
        response = (
            supabase.table("rag_tasks")
            .select("id,status,node_type,path,from_task_id,created_at", count="exact")
            .eq("repo_name", repo_name)
            .order("created_at", desc=True)
            .execute()
        )
        return response
    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})

class UpdateKnowledgeRequest(BaseModel):
    bot_id: str

@router.post("/rag/update_knowledge", dependencies=[Depends(verify_rate_limit)])
def update_knowledge(request: UpdateKnowledgeRequest, user_id: Annotated[str | None, Depends(get_user_id)] = None):
    try:
        # Get config from database using bot_id
        supabase = get_client()
        response = (
            supabase.table("bots")
            .select("*")
            .eq("id", request.bot_id)
            .eq("uid", user_id)
            .single()
            .execute()
        )
        
        if not response.data:
            return json.dumps({
                "success": False,
                "message": f"Bot with id {request.bot_id} not found"
            })
            
        bot_config = RAGGitDocConfig(**response.data)
        result = retrieval.check_and_update_knowledge(bot_config)
        
        if result:
            return json.dumps({
                "success": True,
                "message": "Knowledge updated successfully!"
            })
        else:
            return json.dumps({
                "success": False,
                "message": "Knowledge not updated!"
            })
    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})
