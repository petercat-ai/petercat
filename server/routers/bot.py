from fastapi import APIRouter, Depends, HTTPException, Query, Body, Path
from typing import Optional, List
from pydantic import BaseModel
from db.supabase.client import get_client
class BotCreateRequest(BaseModel):
    uid: str
    avatar: Optional[str] = None
    description: Optional[str] = None
    prompt: Optional[str] = None
    files: Optional[List[str]] = None  # 假设为文件的URL或标识符列表
    enable_img_generation: Optional[bool] = None
    label: Optional[str] = None
    name: Optional[str] = None
    starters: Optional[List[str]] = None  # 假设为起始文本列表
    voice: Optional[str] = None
    public: Optional[bool] = None
class BotUpdateRequest(BaseModel):
    avatar: Optional[str] = None
    description: Optional[str] = None
    prompt: Optional[str] = None
    files: Optional[List[str]] = None
    enable_img_generation: Optional[bool] = None
    label: Optional[str] = None
    name: Optional[str] = None
    starters: Optional[List[str]] = None
    voice: Optional[str] = None
    public: Optional[bool] = None
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
    
@router.get("/config")
def get_bot_config(id: Optional[str] = Query(None, description="Filter bots by personal category")):
    uid = "google-oauth2|110531372948747483359"
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
