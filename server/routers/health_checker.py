from fastapi import APIRouter, Depends, HTTPException
from uilts.env import get_env_variable

task_root = get_env_variable("LAMBDA_TASK_ROOT")

router = APIRouter(
    prefix="/api",
    tags=["health_checkers"],
    responses={404: {"description": "Not found"}},
)

@router.get("/health_checker")
def health_checker():
    return {
        "Hello": "World",
        "task_root": task_root,
    }