from typing import List
from core.dao.BaseDAO import BaseDAO
from core.models.bot import RepoBindBotConfigVO
from core.models.repository import RepositoryConfig
from supabase.client import Client
from petercat_utils.db.client.supabase import get_client


class RepositoryConfigDAO(BaseDAO):
    client: Client

    def __init__(self):
        super().__init__()
        self.client = get_client()

    def create(self, data: RepositoryConfig):
        try:
            repo_config = (
                self.client.from_("github_repo_config")
                .insert(data.model_dump(exclude=["id"]))
                .execute()
            )
            if repo_config:
                return True, {"message": "GithubRepoConfig created successfully"}
            else:
                return False, {"message": "GithubRepoConfig creation failed"}
        except Exception as e:
            print(f"Error: {e}")
            return False, {"message": f"GithubRepoConfig creation failed: {e}"}

    def create_batch(self, data_list: List[RepositoryConfig]):
        try:
            records_data = [data.model_dump(exclude=["id"]) for data in data_list]
            repo_config = (
                self.client.from_("github_repo_config").insert(records_data).execute()
            )
            if repo_config:
                return True, {
                    "message": "GithubRepoConfig records created successfully"
                }
            else:
                return False, {"message": "GithubRepoConfig batch creation failed"}
        except Exception as e:
            print(f"Error: {e}")
            return False, {"message": f"GithubRepoConfig batch creation failed: {e}"}

    def query_by_owners(self, orgs: List[str]):
        try:
            response = (
                self.client.table("github_repo_config")
                .select("*")
                .filter("owner_id", "in", f"({','.join(map(str, orgs))})")
                .execute()
            )
            return response.data
        except Exception as e:
            print(f"Error: {e}")
            return None

    def update_bot_to_repos(self, repos: List[RepoBindBotConfigVO]) -> bool:
        try:
            for repo in repos:
                res = (
                    self.client.table("github_repo_config")
                    .update({"robot_id": repo.robot_id})
                    .match({"repo_id": repo.repo_id})
                    .execute()
                )
                if not res:
                    raise ValueError("Failed to bind the bot.")
            return True
        except Exception as e:
            print(f"Error: {e}")
            return False

    def get_by_repo_name(self, repo_name: str):
        try:
            response = (
                self.client.table("github_repo_config")
                .select("*")
                .eq("repo_name", repo_name)
                .execute()
            )
            if not response.data or not response.data[0]:
                return None
            repo_config = response.data[0]
            return RepositoryConfig(**repo_config)
        except Exception as e:
            print(f"Error: {e}")
            return None

    def get_by_bot_id(self, bot_id: str):
        try:
            response = (
                self.client.table("github_repo_config")
                .select("*")
                .eq("robot_id", bot_id)
                .execute()
            )
            if not response.data or not response.data[0]:
                return None
            return [RepositoryConfig(**repo) for repo in response.data]
        except Exception as e:
            print(f"Error: {e}")
            return None

    def delete_by_repo_ids(self, repo_ids: List[str]):
        try:
            response = (
                self.client.table("github_repo_config")
                .delete()
                .in_("repo_id", repo_ids)
                .execute()
            )
            return response
        except Exception as e:
            print(f"Error: {e}")
            return None
