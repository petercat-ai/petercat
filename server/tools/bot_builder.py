from langchain.tools import tool
from github import Github
from db.supabase.client import get_client
from prompts.bot_template import generate_prompt_by_repo_name

g = Github()

@tool
def create_bot(
    repo_name: str,
    starters: list[str] = ["介绍一下项目", "快速上手", "贡献指南"],
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
          "uid": "u123456", # TODO get from auth
          "enable_img_generation": False,
          "label": "Assistant",
          "starters": starters,
          "enable_img_generation": False,
          "public": False,
        }
        print('bot_data', bot_data)
        supabase = get_client()
        response = supabase.table("bots").insert(bot_data).execute()
        return response
    except Exception as e:
        print(f"An error occurred: {e}")
        return e

