from core.dao.BaseDAO import BaseDAO
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
                .insert(data.model_dump())
                .execute()
            )
            if repo_config:
                return True, {"message": "GithubRepoConfig created successfully"}
            else:
                return False, {"message": "GithubRepoConfig creation failed"}
        except Exception as e:
            print("Error: ", e)
            return False, {"message": "GithubRepoConfig creation failed"}

    def query_by_orgs(self, orgs: list[str]):
        response = (
            self.client.table("github_repo_config")
            .select("*")
            .filter("owner_id", "in", f"({','.join(map(str, orgs))})")
            .execute()
        )

        return response.data

    def get_by_repo_name(self, repo_name: str):
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
