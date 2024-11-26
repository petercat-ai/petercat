from datetime import datetime
from fastapi import APIRouter, Request, Depends, status, Query, Path
from fastapi.responses import JSONResponse
from github import Github, Auth
from auth.get_user_info import get_user, get_user_id
from core.dao.botApprovalDAO import BotApprovalDAO
from core.dao.botDAO import BotDAO
from core.models.bot_approval import ApprovalStatus, BotApproval, TaskType
from core.models.user import User
from petercat_utils import get_client
from typing import Annotated, Optional

from bot.builder import bot_builder, bot_info_generator
from core.type_class.bot import BotDeployRequest, BotUpdateRequest, BotCreateRequest

router = APIRouter(
    prefix="/api/bot",
    tags=["bot"],
    responses={404: {"description": "Not found"}},
)

OFFICIAL_REPO = "petercat-ai/petercat"


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
                    "id, created_at, updated_at, avatar, description, name, starters, public, hello_message, repo_name"
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
    request: Request,
    bot_data: BotCreateRequest,
    user_id: Annotated[str | None, Depends(get_user_id)] = None,
):
    lang = bot_data.lang or "en"
    default_starters = [
        request.state.i18n.get_text("starter0", lang),
        request.state.i18n.get_text("starter1", lang),
        request.state.i18n.get_text("starter2", lang),
    ]
    default_hello_message = request.state.i18n.get_text("hello_message", lang)
    starters = bot_data.starters if bot_data.starters else default_starters
    hello_message = (
        bot_data.hello_message if bot_data.hello_message else default_hello_message
    )

    try:
        res = await bot_builder(user_id, bot_data.repo_name, starters, hello_message)
        if not res:
            return JSONResponse(
                content={
                    "success": False,
                    "errorMessage": "Repository does not exist, generation failed.",
                },
                status_code=500,
            )
        return res
    except Exception as e:
        return JSONResponse(
            content={"success": False, "errorMessage": str(e)}, status_code=500
        )


@router.post("/config/generator", status_code=200)
async def bot_generator(
    request: Request,
    bot_data: BotCreateRequest,
    user_id: Annotated[str | None, Depends(get_user_id)] = None,
):
    lang = bot_data.lang or "en"
    default_starters = [
        request.state.i18n.get_text("starter0", lang),
        request.state.i18n.get_text("starter1", lang),
        request.state.i18n.get_text("starter2", lang),
    ]
    default_hello_message = request.state.i18n.get_text("hello_message", lang)
    starters = bot_data.starters if bot_data.starters else default_starters
    hello_message = (
        bot_data.hello_message if bot_data.hello_message else default_hello_message
    )
    try:
        res = await bot_info_generator(
            user_id, bot_data.repo_name, starters, hello_message
        )
        if not res:
            return JSONResponse(
                content={
                    "success": False,
                    "errorMessage": "Repository does not exist, generation failed.",
                }
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
    blacklist_fields = {"public"}

    try:
        update_fields = {
            key: value
            for key, value in bot_data.model_dump(exclude_unset=True).items()
            if value is not None and key not in blacklist_fields
        }
        if not update_fields:
            return JSONResponse(
                content={"success": False, "errorMessage": "No fields to update."},
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
                content={
                    "success": False,
                    "errorMessage": "Bot does not exist, update failed.",
                }
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
                content={
                    "success": False,
                    "errorMessage": "Bot does not exist, delete failed.",
                }
            )
        return JSONResponse(content={"success": True})
    except Exception as e:
        return JSONResponse(
            content={"success": False, "errorMessage": str(e)}, status_code=500
        )


@router.post("/deploy/market/public", status_code=200)
async def deploy_bot_to_market(
    body: BotDeployRequest, user: Annotated[User | None, Depends(get_user)] = None
):
    bot_id = body.bot_id
    try:
        if not user:
            return JSONResponse(
                content={
                    "success": False,
                    "errorMessage": "You must first log in to Petercat with GitHub before you can use this function.",
                },
                status_code=500,
            )
        bot_dao = BotDAO()
        bot = bot_dao.get_bot(bot_id)
        if not bot:
            return JSONResponse(
                content={
                    "success": False,
                    "errorMessage": "Bot does not exist, cannot perform operation.",
                },
                status_code=500,
            )
        if bot.public:
            return JSONResponse(
                content={
                    "success": False,
                    "errorMessage": "Bot is already public, no need to repeat the operation.",
                },
                status_code=500,
            )
        auth = Auth.Token(token=user.access_token)
        g = Github(auth=auth)
        repo = g.get_repo(OFFICIAL_REPO)
        issue_title = f"Market approval: {bot.name}"
        issue_body = f"""I would like to publish it on the official marketplace. Here is the information about my bot.\n

| bot_id     | bot_name | bot_description |
|------------|----------|-----------------|
| {bot.id} | {bot.name} | {bot.description} |
        """
        issue = repo.create_issue(
            title=issue_title, body=issue_body, labels=["approval"]
        )
        bot_approval_dao = BotApprovalDAO()
        bot_approval = BotApproval(
            bot_id=bot.id,
            approval_status=ApprovalStatus.OPEN,
            task_type=TaskType.MARKET,
            approval_path=issue.html_url,
            created_at=datetime.now(),
        )
        success, _ = bot_approval_dao.create(bot_approval)
        if success:
            return {"success": True, "approval_path": issue.html_url}
        else:
            raise Exception("Failed to create the bot approval.")

    except Exception as e:
        return JSONResponse(
            content={"success": False, "errorMessage": str(e)}, status_code=500
        )


@router.post("/deploy/market/unPublic", status_code=200)
async def unPublic_bot_from_market(
    body: BotDeployRequest, user: Annotated[User | None, Depends(get_user)] = None
):
    bot_id = body.bot_id
    try:
        if not user:
            return JSONResponse(
                content={
                    "success": False,
                    "errorMessage": "You must first log in to Petercat with GitHub before you can use this function.",
                },
                status_code=500,
            )
        bot_dao = BotDAO()
        bot = bot_dao.get_bot(bot_id)
        if not bot:
            return JSONResponse(
                content={
                    "success": False,
                    "errorMessage": "Bot does not exist, cannot perform operation.",
                },
                status_code=500,
            )
        if not bot["public"]:
            return JSONResponse(
                content={
                    "success": False,
                    "errorMessage": "Bot is already public, no need to repeat the operation.",
                },
                status_code=500,
            )
        auth = Auth.Token(token=user.access_token)
        g = Github(auth=auth)
        repo = g.get_repo(OFFICIAL_REPO)
        issue_title = f"Market approval: {bot.name}"
        issue_body = f"""Please remove this robot from the market. Thank you.\n
| bot_id     | bot_name    | bot_description    |
|--------------|-----------|-----------|
| {bot.id} | {bot.name} | {bot.description} |
        """
        issue = repo.create_issue(
            title=issue_title, body=issue_body, labels=["approval"]
        )
        bot_approval_dao = BotApprovalDAO()
        bot_approval = BotApproval(
            bot_id=bot.id,
            approval_status=ApprovalStatus.OPEN,
            task_type=TaskType.MARKET,
            approval_path=issue.html_url,
            created_at=datetime.now(),
        )
        bot_approval_dao.create(bot_approval)
        return {"success": True, "approval_path": issue.html_url}

    except Exception as e:
        return JSONResponse(
            content={"success": False, "errorMessage": str(e)}, status_code=500
        )


@router.post("/deploy/website", status_code=200)
async def deploy_bot_to_website(
    body: BotDeployRequest,
    user: Annotated[User | None, Depends(get_user)] = None,
):
    bot_id = body.bot_id
    website_url = body.website_url
    try:
        if not user:
            return JSONResponse(
                content={
                    "success": False,
                    "errorMessage": "您必须先使用 GitHub 登录 Petercat 才能使用此功能。",
                },
                status_code=500,
            )
        bot_dao = BotDAO()
        bot = bot_dao.get_bot(bot_id)
        if not bot:
            return JSONResponse(
                content={"success": False, "errorMessage": "机器人不存在,无法操作"},
                status_code=500,
            )
        auth = Auth.Token(token=user.access_token)
        g = Github(auth=auth)
        repo = g.get_repo(OFFICIAL_REPO)
        issue_title = f"Website Deployment Application : {bot.name}"
        issue_body = f"""I would like to deploy the robot on my website. Here is the information about my bot.\n
| bot_id     | bot_name    | bot_description    |
|--------------|-----------|-----------|
| {bot.id} | {bot.name} | {bot.description} |
        \n

My website: **{website_url}**
        """
        issue = repo.create_issue(
            title=issue_title, body=issue_body, labels=["approval"]
        )
        bot_approval_dao = BotApprovalDAO()
        bot_approval = BotApproval(
            bot_id=bot.id,
            approval_status=ApprovalStatus.OPEN,
            approval_path=issue.html_url,
            task_type=TaskType.WEBSITE,
            created_at=datetime.now(),
        )
        success, _ = bot_approval_dao.create(bot_approval)
        if success:
            return {"success": True, "approval_path": issue.html_url}
        else:
            raise Exception("Failed to create the bot website approval.")
    except Exception as e:
        return JSONResponse(
            content={"success": False, "errorMessage": str(e)}, status_code=500
        )


@router.get("/approval/list")
def get_bot_approval_config(
    bot_id: str = Query(None, description="approval for bot id"),
    status: Optional[ApprovalStatus] = Query(
        None, description="approval status ,open or closed"
    ),
    user: Annotated[User | None, Depends(get_user)] = None,
):
    try:
        bot_approval_dao = BotApprovalDAO()
        (success, data) = bot_approval_dao.query(bot_id, status.value)
        if not success:
            raise ValueError(data)
        if status:
            data = list(filter(lambda x: x["approval_status"] == status.value, data))
            auth = Auth.Token(token=user.access_token)
            g = Github(auth=auth)
            repo = g.get_repo(OFFICIAL_REPO)
            for item in data:
                if not item["approval_path"]:
                    continue
                issue_num = int(item["approval_path"].split("/")[-1])
                issue = repo.get_issue(issue_num)
                if issue.state == "closed":
                    item["approval_status"] = ApprovalStatus.CLOSED
                    # update approval status to closed
                    bot_approval_dao.update_approval_status(
                        item["id"], ApprovalStatus.CLOSED.value
                    )
        # filter again
        data = list(filter(lambda x: x["approval_status"] == status.value, data))
        # check data item issue is closed
        return {"data": data, "status": 200}
    except Exception as e:
        return JSONResponse(content={"success": False, "errorMessage": e})
