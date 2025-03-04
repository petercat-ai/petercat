from typing import List, Optional

from github import Github
from core.models.user import User
from whiskerrag_client import APIClient
from whiskerrag_types.model import (
    KnowledgeCreate,
    KnowledgeSplitConfig,
    KnowledgeSourceEnum,
    KnowledgeTypeEnum,
    GithubRepoSourceConfig,
)
from agent.prompts.bot_template import generate_prompt_by_repo_name
from utils.env import get_env_variable
from utils.supabase import get_client

g = Github()


async def bot_info_generator(
    uid: str,
    repo_name: str,
    starters: Optional[List[str]] = None,
    hello_message: Optional[str] = None,
):
    try:
        # Step1:Get the repository object
        repo = g.get_repo(repo_name)
        # Step2: Generate the prompt
        prompt = generate_prompt_by_repo_name(repo_name)

        # Step3: Generate the bot data
        bot_data = {
            "name": repo.name,
            "description": repo.description,
            "avatar": repo.organization.avatar_url if repo.organization else None,
            "prompt": prompt,
            "uid": uid,
            "label": "Assistant",
            "starters": starters,
            "public": False,
            "hello_message": hello_message,
            "repo_name": repo_name,
            "llm": "openai",
            "token_id": "",
        }

        return bot_data
    except Exception as e:
        print(f"An error occurred: {e}")
        return None


async def bot_builder(
    user: User,
    repo_name: str,
    starters: Optional[List[str]] = None,
    hello_message: Optional[str] = None,
):
    """
    create a bot based on the given github repository.

    :param uid: The user id of the bot owner
    :param repo_name: The name of the repository, e.g., "ant-design/ant-design"
    :param starters: The Opening Dialog, e.g.["介绍一下项目", "快速上手", "贡献指南"]
    :param hello_message: The hello message of the bot
    """
    try:
        bot_data = await bot_info_generator(
            user.sub, repo_name, starters, hello_message
        )
        if not bot_data:
            return None
        supabase = get_client()
        response = supabase.table("bots").insert(bot_data).execute()
        if response:
            try:
                api_client = APIClient(
                    base_url=get_env_variable("WHISKER_API_URL"),
                    token=get_env_variable("WHISKER_API_KEY"),
                )
                await api_client.knowledge.add_knowledge(
                    [
                        KnowledgeCreate(
                            source_type=KnowledgeSourceEnum.GITHUB_REPO,
                            knowledge_type=KnowledgeTypeEnum.FOLDER,
                            space_id=repo_name,
                            knowledge_name=repo_name,
                            source_config=GithubRepoSourceConfig(
                                repo_name=repo_name, auth_token=user.access_token
                            ),
                            split_config=KnowledgeSplitConfig(
                                chunk_size=500,
                                chunk_overlap=100,
                            ),
                        )
                    ]
                )
            except Exception as e:
                print(f"Add repo knowledge error: {e}")
        return response
    except Exception as e:
        print(f"An error occurred: {e}")
        return e
