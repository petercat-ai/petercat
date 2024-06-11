from fastapi import APIRouter, Cookie, status, HTTPException, Query, Body, Path
from db.supabase.client import get_client
from bot.builder import bot_builder
from type_class.bot import BotUpdateRequest, BotCreateRequest
from typing import Optional



# 定义执行 SQL 查询的函数
def execute_sql(sql: str):
    try:
        supabase = get_client()
        response = supabase.rpc("execute_sql", {"query": sql}).execute()
        return response
    except Exception as e:
        print("An error occurred:", e)
        if hasattr(e, 'details'):
            print("Error details:", e.details)
        if hasattr(e, 'message'):
            print("Error message:", e.message)
        if hasattr(e, 'hint'):
            print("Error hint:", e.hint)
  
router = APIRouter(
  prefix="/api/bot",
  tags=["bot"],
  responses={404: {"description": "Not found"}},
)

@router.get("/list")
def get_bot_list(personal: Optional[str] = Query(None, description="Filter bots by personal category"), name: Optional[str] = Query(None, description="Filter bots by name"), user_id: str = Cookie(None)):
    supabase = get_client()
    if personal == 'true':
        if not user_id:
          return { "data": [], "personal": personal}
        else :
          if not name:
            data = supabase.table("bots").select("id, created_at, updated_at, avatar, description, name, public").eq('public', 'true').eq('uid', user_id).execute()
          else :
            sql = f"""
              SELECT * FROM bots where public = true and name like '%{name}%'
            """
            data = execute_sql(sql)
           
    else :
        if not name: 
          data = supabase.table("bots").select("id, created_at, updated_at, avatar, description, name, starters, public").eq('public', 'true').execute()
        else:
          sql = f"""
            SELECT * FROM bots where public = true and name like '%{name}%'
          """
          data = execute_sql(sql)
    if not data or not data.data:
      return { "data": [], "personal": personal}
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
      data = supabase.table("bots").select('id, created_at, updated_at, avatar, description, name, starters, public, hello_message').eq('id', id).execute()
      return { "data": data.data, "status": 200}
    
@router.get("/config")
def get_bot_config(id: Optional[str] = Query(None, description="Filter bots by personal category"), user_id: str = Cookie(None)):
    if not id or not user_id: 
      return{
        "error": "Auth failed",
        "status": 401
      }
    else :
      supabase = get_client()
      data = supabase.table("bots").select('*').eq('id', id).eq('uid', user_id).execute()
      return { "data": data.data, "status": 200}

@router.post("/create", status_code=200)
async def create_bot(bot_data: BotCreateRequest,  user_id: str = Cookie(None)):
    if not user_id:
      raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Must Login")
    return await bot_builder(user_id, **bot_data.model_dump())

@router.put("/update/{id}", status_code=200)
def update_bot(id: str, bot_data: BotUpdateRequest = Body(...), user_id: str = Cookie(None)):
    if not user_id: 
      return{
        "error": "Auth failed",
        "status": 401
      }
    supabase = get_client()
    supabase.table("bots").update(bot_data.dict()).eq("id", id).eq("uid", user_id).execute()
    return {"status": 200}

@router.delete("/delete/{id}", status_code=200)
def delete_bot(id: str = Path(..., description="The ID of the bot to delete"), user_id: str = Cookie(None)):
    if not user_id: 
      return{
        "error": "Auth failed",
        "status": 401
      }
    supabase = get_client()
    response = supabase.table("bots").delete().eq("id", id).eq("uid", user_id).execute()
    return {"status": 200}
