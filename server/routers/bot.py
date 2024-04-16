from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from db.supabase.client import get_client

router = APIRouter(
    prefix="/api/bot",
    tags=["bot"],
    responses={404: {"description": "Not found"}},
)

@router.get("/list")
def get_bot_list(personal: Optional[str] = Query(None, description="Filter bots by personal category")):
    supabase = get_client()
    data = supabase.table("bots").select("id, created_at, updated_at, avatar, description, enable_img_generation, label, name, starters, voice, public").eq('public', 'true').execute()
    return { "data": data.data, "personal": personal}

@router.get("/detail")
def get_bot_detail(id: Optional[str] = Query(None, description="Filter bots by personal category")):
    if not id : 
      return{
        "error": "Incomplete parameters",
        "status": 400
      }
    else :
      supabase = get_client()
      data = supabase.table("bots").select('id, created_at, updated_at, avatar, description, enable_img_generation, label, name, starters, voice, public').eq('id', id).execute()
      return { "data": data.data, "status": 200}
    