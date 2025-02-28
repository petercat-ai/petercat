from typing import Optional
from fastapi import APIRouter

from petercat_utils import get_client
from petercat_utils.rag_helper.task import TaskStatus

TABLE_NAME = "rag_tasks"

router = APIRouter(
    prefix="/api/task",
    tags=["task"],
    responses={404: {"description": "Not found"}},
)


@router.get("/list")
def get_tasks(page_size="10", page_number="1", status: Optional[TaskStatus] = None):
    start = (int(page_number) - 1) * int(page_size)
    end = int(page_number) * int(page_size)
    supabase = get_client()

    sql = (
        supabase.table(TABLE_NAME)
        .select("*", count="exact")
        .range(start=start, end=end)
    )
    response = sql.execute() if status is None else sql.eq("status", status).execute()

    return {
        "success": True,
        "data": response.data,
        "pagination": {
            "count": response.count,
            "page_size": page_size,
            "page_number": page_number,
        },
    }


@router.get("/{task_id}")
def get_task(task_id: str):
    supabase = get_client()

    response = supabase.table(TABLE_NAME).select("*").eq("id", task_id).execute()

    return response.data[0] if (len(response.data) > 0) else None
