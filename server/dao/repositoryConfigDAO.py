
import json
from dao.BaseDAO import BaseDAO
from models.repository import RepositoryConfig
from supabase.client import Client, create_client

from petercat_utils.db.client.supabase import get_client

class RepositoryConfigDAO(BaseDAO):
    client: Client

    def __init__(self):
        super().__init__()
        self.client = get_client()

    def create(self, data: RepositoryConfig):
        print('supabase github_repo_config creation', data.model_dump())
        try:
            authorization = self.client.from_("github_repo_config")\
                    .insert(data.model_dump())\
                    .execute()
            if authorization:
                return True, {"message": "GithubRepoConfig created successfully"}
            else:
                return False, {"message": "GithubRepoConfig creation failed"}
        except Exception as e:
            print("Error: ", e)
            return False, {"message": "GithubRepoConfig creation failed"}