import json
from typing import Optional
from fastapi import APIRouter, Depends
from insight.service.issue import get_issue_data
from insight.service.pr import get_code_changes, get_pr_data


router = APIRouter(
    prefix="/api/insight",
    tags=["insight"],
    responses={404: {"description": "Not found"}},
)


@router.get("/issue")
def get_issue_insight(repo_name: str):
    try:
        result = get_issue_data(repo_name)
        return {
            "success": True,
            "data": result,
        }

    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})


@router.get("/pr")
def get_pr_insight(repo_name: str):
    try:
        result = get_pr_data(repo_name)
        return {
            "success": True,
            "data": result,
        }

    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})


@router.get("code_change")
def get_code_change_insight(repo_name: str):
    try:
        result = get_code_changes(repo_name)
        return {
            "success": True,
            "data": result,
        }

    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})
