import json
from typing import Optional
from langchain.tools import tool
from github import Github
from db.supabase.client import get_client
from prompts.bot_template import generate_prompt_by_repo_name
from auth.get_user_info import getUserInfoByToken
from bot.builder import bot_builder

g = Github()

@tool
async def create_bot(
    repo_name: str,
    starters: list[str] = ["介绍一下项目", "快速上手", "贡献指南"],
):
    """
    create a bot based on the given github repository.

    :param repo_name: The name of the repository, e.g., "octocat/Hello-World"
    :param starters: The Opening Dialog, e.g.["介绍一下项目", "快速上手", "贡献指南"]
    """
    res = await bot_builder(repo_name, starters)
    return res

@tool
def edit_bot(
        id: str,
        name: Optional[str] = None,
        description : Optional[str] = None,
        prompt: Optional[str] = None,
        starters: Optional[list[str]] = None,
    ):
    """
    edit a bot based on the given params
    
    :param id: The id of the bot, e.g., "1234567890"
    :param name: The name of the bot, e.g., "Ant Design"
    :param description: The description of the bot, e.g., "A design system for enterprise-level products."
    :param prompt: The prompt of the bot, e.g., "You are an AI assistant designed to help users with their needs. You can answer questions about Ant Design, provide design resources, and offer advice on how to use Ant Design in your projects. Your responses should be clear, concise, and helpful."
    :param starters: The Opening Dialog, e.g., ["介绍一下项目", "快速上手", "贡献指南"]
    """
    try:
        # Step1: Get the bot object
        supabase = get_client()
        bot = supabase.table("bots").select("*").eq("id", id).execute().data[0]
        if not bot:
            raise ValueError(f"Bot with ID {id} not found.")

        # Step2: Update the bot data
        uid = "u123456" # TODO get from auth
        bot_data = {
            "name":  name if name else bot["name"],
            "description": description if description else bot["description"],
            "avatar": bot["avatar"],
            "prompt": prompt if prompt else bot["prompt"],
            "uid": uid, 
            "enable_img_generation": False,
            "label": "Assistant",
            "starters": starters if isinstance(starters, list) and starters else bot["starters"],
            "enable_img_generation": False,
            "public": False,
        }
        
        
        # Step3: Save the changes to the database
        response = supabase.table("bots").update(bot_data).eq("id", id).eq("uid", uid).execute()
        return response
    except Exception as e:
        print(f"An error occurred: {e}")
        return e
   
   
   
