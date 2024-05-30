from fastapi import APIRouter,Cookie, Query, Body, Path, HTTPException
from db.supabase.client import get_client
from type_class.bot import BotUpdateRequest, BotCreateRequest
from typing import Optional
from auth.get_user_info import getUserInfoByToken

router = APIRouter(
    prefix="/api/bot",
    tags=["bot"],
    responses={404: {"description": "Not found"}},
)

@router.get("/list")
def get_bot_list(personal: Optional[str] = Query(None, description="Filter bots by personal category"), user_id: str = Cookie(None)):
    supabase = get_client()
    print(f'personal:{personal}')
    if personal == 'true':
        if not user_id:
          return { "data": [], "personal": personal}
        data = supabase.table("bots").select("id, created_at, updated_at, avatar, description, enable_img_generation, label, name, starters, voice, public").eq('public', 'true').eq('uid', user_id).execute()
    if personal == 'false':
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
    
@router.get("/config")
def get_bot_config(id: Optional[str] = Query(None, description="Filter bots by personal category")):
    uid = "u123456"
    if not id or not uid: 
      return{
        "error": "Auth failed",
        "status": 401
      }
    else :
      supabase = get_client()
      data = supabase.table("bots").select('*').eq('id', id).eq('uid', uid).execute()
      return { "data": data.data, "status": 200}

@router.post("/create", status_code=200)
def create_bot(bot_data: BotCreateRequest):
    supabase = get_client()
    bot_data.uid = "u123456"
    response = supabase.table("bots").insert(bot_data.dict()).execute()
    return {"status": 200}

@router.put("/update/{id}", status_code=200)
def update_bot(id: str, bot_data: BotUpdateRequest = Body(...)):
    supabase = get_client()
    uid = "u123456"
    response = supabase.table("bots").update(bot_data.dict()).eq("id", id).eq("uid", uid).execute()
    return {"status": 200}

@router.delete("/delete/{id}", status_code=200)
def delete_bot(id: str = Path(..., description="The ID of the bot to delete")):
    supabase = get_client()
    uid = "u123456"
    response = supabase.table("bots").delete().eq("id", id).eq("uid", uid).execute()
    return {"status": 200}
