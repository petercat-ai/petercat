from typing import List, Optional
from fastapi.responses import JSONResponse
from langchain.tools import tool
from github import Github

from bot.builder import bot_builder
from utils.supabase import get_client

g = Github()


@tool
async def create_bot(
    repo_name: str,
    uid: str,
    starters: Optional[List[str]] = None,
    hello_message: Optional[str] = None,
):
    """
    Create a bot based on the specified GitHub repository.

    :param repo_name: The full name of the GitHub repository (e.g., "ant-design/ant-design").
    :param uid: The unique identifier of the bot owner.
    :param starters: Optional. A list of opening dialogue prompts (e.g., ["介绍一下项目", "快速上手", "贡献指南"]).
    :param hello_message: Optional. A custom hello message for the bot.
    """
    res = await bot_builder(uid, repo_name, starters, hello_message)
    if not res:
        return JSONResponse(
            content={"success": False, "errorMessage": "Failed to create bot."}
        )
    return res.json()


@tool
def edit_bot(
    id: str,
    uid: str,
    avatar: Optional[str] = None,
    name: Optional[str] = None,
    description: Optional[str] = None,
    prompt: Optional[str] = None,
    starters: Optional[list[str]] = None,
    hello_message: Optional[str] = None,
):
    """
    Modify Bot Configuration based on the given parameters.

    :param id: The unique identifier of the bot (e.g., "1234567890").
    :param uid: The unique identifier of the bot owner.
    :param avatar: Optional. The URL of the bot's avatar image (e.g., "https://avatars.githubusercontent.com/u/12101536?v=4").
    :param name: Optional. The name of the bot (e.g., "Ant Design").
    :param description: Optional. A brief description of the bot (e.g., "A design system for enterprise-level products.").
    :param prompt: Optional. The main prompt or purpose of the bot (e.g., "You are an AI assistant designed to help users with their needs. You can answer questions about Ant Design, provide design resources, and offer advice on how to use Ant Design in your projects. Your responses should be clear, concise, and helpful.").
    :param starters: Optional. A list of opening dialogue prompts (e.g., ["介绍一下项目", "快速上手", "贡献指南"]).
    :param hello_message: Optional. A custom hello message for the bot (e.g., "我是你专属的答疑机器人，你可以问我关于当前项目的任何问题").
    """
    try:
        # Step1: Get the bot object
        supabase = get_client()
        bot = (
            supabase.table("bots")
            .select("*")
            .eq("id", id)
            .eq("uid", uid)
            .execute()
            .data[0]
        )
        if not bot:
            raise ValueError(f"Bot with ID {id} not found.")

        # Step2: Update the bot data
        bot_data = {
            "name": name if name else bot["name"],
            "description": description if description else bot["description"],
            "avatar": avatar if avatar else bot["avatar"],
            "prompt": prompt if prompt else bot["prompt"],
            "uid": bot["uid"],
            "label": "Assistant",
            "starters": (
                starters if isinstance(starters, list) and starters else bot["starters"]
            ),
            "public": bot["public"],
            "hello_message": hello_message if hello_message else bot["hello_message"],
        }

        # Step3: Save the changes to the database
        response = (
            supabase.table("bots")
            .update(bot_data)
            .eq("id", id)
            .eq("uid", uid)
            .execute()
        )
        return response.json()
    except Exception as e:
        print(f"An error occurred: {e}")
        return e
