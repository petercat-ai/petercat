from fastapi import APIRouter, Depends

from verify.rate_limit import verify_rate_limit

router = APIRouter(
    prefix="/api",
    tags=["health_checkers"],
    responses={404: {"description": "Not found"}},
)

@router.get("/health_checker")
def health_checker():
    return { "Hello": "World" }

@router.get("/login_checker", dependencies=[Depends(verify_rate_limit)])
def login_checker():
    return { "Hello": "World" }