from supabase.client import Client

from core.models.user_token_usage import UserTokenUsage
from petercat_utils.db.client.supabase import get_client
from core.dao.BaseDAO import BaseDAO


class UserTokenUsageDAO(BaseDAO):
    client: Client

    def __init__(self):
        super().__init__()
        self.client = get_client()

    def create(self, token_usage: UserTokenUsage):
        return (
            self.client.table("user_token_usage")
            .insert(token_usage.model_dump(exclude=["id"]))
            .execute()
        )
