from typing import Optional
from fastapi import APIRouter


router = APIRouter(
    prefix="/api/task",
    tags=["task"],
    responses={404: {"description": "Not found"}},
)
