from typing import List, Optional
from github import Github
from db.supabase.client import get_client
from prompts.bot_template import generate_prompt_by_repo_name
from auth.get_user_info import getUserInfoByToken

g = Github()

async def bot_builder(
    uid: str,
    repo_name: str,
    starters: Optional[List[str]] = None,
    hello_message: Optional[str] = None
):
    """
    create a bot based on the given github repository.

    :param repo_name: The name of the repository, e.g., "octocat/Hello-World"
    :param starters: The Opening Dialog, e.g.["介绍一下项目", "快速上手", "贡献指南"]
    """
    try:
        # Step1:Get the repository object
        repo = g.get_repo(repo_name)

        # Step2: Generate the prompt
        prompt = generate_prompt_by_repo_name(repo_name)
        
        # Step3: Create bot based on the prompt
        bot_data = {
          "name":  repo.name,
          "description": repo.description,
          "avatar": repo.organization.avatar_url if repo.organization else None,
          "prompt": prompt,
          "uid": uid,
          "label": "Assistant",
          "starters": starters if starters else [f"介绍一下 {repo.name} 这个项目", f"查看 {repo_name} 的贡献指南", "我该怎样快速上市哦"],
          "public": False,
          "hello_message": hello_message if hello_message else "我是你专属的答疑机器人，你可以问我关于当前项目的任何问题，比如~"
        }
        supabase = get_client()
        response = supabase.table("bots").insert(bot_data).execute()
        print('bot_data_response', bot_data)
        return response
    except Exception as e:
        print(f"An error occurred: {e}")
        return e
