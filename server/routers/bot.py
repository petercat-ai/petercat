from fastapi import APIRouter, Depends, status, Query, Path
from fastapi.responses import JSONResponse
from petercat_utils import get_client
from typing import Annotated, Optional

from auth.get_user_info import get_user_id
from bot.builder import bot_builder, bot_info_generator
from type_class.bot import BotUpdateRequest, BotCreateRequest

router = APIRouter(
    prefix="/api/bot",
    tags=["bot"],
    responses={404: {"description": "Not found"}},
)


@router.get("/list")
def get_bot_list(
    personal: Optional[str] = Query(
        None, description="Filter bots by personal category"
    ),
    name: Optional[str] = Query(None, description="Filter bots by name"),
    user_id: Annotated[str | None, Depends(get_user_id)] = None,
):
    try:
        supabase = get_client()
        query = supabase.table("bots").select(
            "id, created_at, updated_at, avatar, description, name, public, starters, uid"
        )
        if personal == "true":
            if not user_id:
                return {"data": [], "personal": personal}
            query = query.eq("uid", user_id).order("updated_at", desc=True)
        if name:
            query = (
                supabase.table("bots")
                .select(
                    "id, created_at, updated_at, avatar, description, name, public, starters, uid"
                )
                .filter("name", "like", f"%{name}%")
            )

        query = (
            query.eq("public", True).order("updated_at", desc=True)
            if not personal or personal != "true"
            else query
        )

        data = query.execute()
        if not data or not data.data:
            return {"data": [], "personal": personal}
        return {"data": data.data, "personal": personal}

    except Exception as e:
        return JSONResponse(
            content={"success": False, "errorMessage": str(e)}, status_code=500
        )


@router.get("/detail")
def get_bot_detail(
    id: Optional[str] = Query(None, description="Filter bots by personal category")
):
    if not id:
        return {"error": "Incomplete parameters", "status": 400}
    else:
        try:
            supabase = get_client()
            data = (
                supabase.table("bots")
                .select(
                    "id, created_at, updated_at, avatar, description, name, starters, public, hello_message"
                )
                .eq("id", id)
                .execute()
            )
            return {"data": data.data, "status": 200}
        except Exception as e:
            return JSONResponse(
                content={"success": False, "errorMessage": str(e)}, status_code=500
            )


@router.get("/config")
def get_bot_config(
    id: Optional[str] = Query(None, description="Filter bots by personal category"),
    user_id: Annotated[str | None, Depends(get_user_id)] = None,
):
    try:
        supabase = get_client()
        data = (
            supabase.table("bots").select("*").eq("id", id).eq("uid", user_id).execute()
        )
        return {"data": data.data, "status": 200}
    except Exception as e:
        return JSONResponse(content={"success": False, "errorMessage": e})


@router.post("/create", status_code=200)
async def create_bot(
    bot_data: BotCreateRequest,
    user_id: Annotated[str | None, Depends(get_user_id)] = None,
):
    try:
        res = await bot_builder(user_id, **bot_data.model_dump())
        if not res:
            return JSONResponse(
                content={"success": False, "errorMessage": "仓库不存在，生成失败"},
                status_code=500,
            )
        return res
    except Exception as e:
        return JSONResponse(
            content={"success": False, "errorMessage": str(e)}, status_code=500
        )


@router.post("/config/generator", status_code=200)
async def bot_generator(
    bot_data: BotCreateRequest,
    user_id: Annotated[str | None, Depends(get_user_id)] = None,
):
    try:
        res = await bot_info_generator(user_id, **bot_data.model_dump())
        if not res:
            return JSONResponse(
                content={"success": False, "errorMessage": "仓库不存在，生成失败"}
            )
        return JSONResponse(content={"success": True, "data": res})
    except Exception as e:
        return JSONResponse(
            content={"success": False, "errorMessage": str(e)}, status_code=500
        )


@router.put("/update/{id}", status_code=200)
def update_bot(
    id: str,
    bot_data: BotUpdateRequest,
    user_id: Annotated[str | None, Depends(get_user_id)] = None,
):
    if not id:
        return {"error": "Incomplete parameters", "status": 400}
    try:
        update_fields = {
            key: value
            for key, value in bot_data.model_dump(exclude_unset=True).items()
            if value is not None
        }

        if not update_fields:
            return JSONResponse(
                content={"success": False, "errorMessage": "No fields to update"},
                status_code=400,
            )

        supabase = get_client()
        response = (
            supabase.table("bots")
            .update(update_fields)
            .eq("id", id)
            .eq("uid", user_id)
            .execute()
        )

        if not response.data:
            return JSONResponse(
                content={"success": False, "errorMessage": "bot 不存在，更新失败"}
            )

        return JSONResponse(content={"success": True})
    except Exception as e:
        return JSONResponse(
            content={"success": False, "errorMessage": str(e)}, status_code=500
        )


@router.delete("/delete/{id}", status_code=status.HTTP_200_OK)
async def delete_bot(
    id: str = Path(..., description="The ID of the bot to delete"),
    user_id: Annotated[str | None, Depends(get_user_id)] = None,
):
    try:
        supabase = get_client()
        response = (
            supabase.table("bots").delete().eq("id", id).eq("uid", user_id).execute()
        )
        if not response.data:
            return JSONResponse(
                content={"success": False, "errorMessage": "bot 不存在，删除失败"}
            )
        return JSONResponse(content={"success": True})
    except Exception as e:
        return JSONResponse(
            content={"success": False, "errorMessage": str(e)}, status_code=500
        )
