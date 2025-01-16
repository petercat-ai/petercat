import json
from typing import Optional
from fastapi import APIRouter, Depends
from insight.service.issue import get_issue_data


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
