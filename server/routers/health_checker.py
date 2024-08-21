from fastapi import APIRouter

router = APIRouter(
    prefix="/api",
    tags=["health_checkers"],
    responses={404: {"description": "Not found"}},
)

@router.get("/health_checker")
def health_checker():
    return { "Hello": "World" }
