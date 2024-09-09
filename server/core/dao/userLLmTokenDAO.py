import logging

from core.dao.BaseDAO import BaseDAO
from supabase.client import Client
from petercat_utils.db.client.supabase import get_client
from core.models.user_llm_token import UserLLMToken

logger = logging.getLogger()
logger.setLevel("INFO")

class UserLLMTokenDAO(BaseDAO):
    client: Client

    def __init__(self):
        super().__init__()
        self.client = get_client()

    def get_by_id(self, id: str, user_id: str):
        query = self.client.table("user_llm_tokens") \
                    .select('*') \
                    .eq("id", id)
        if user_id:
            query = query.eq("user_id", user_id)

        response = query.execute()

        if not response.data or not response.data[0]:
            return None
        return UserLLMToken(**response.data[0])

    def list_by_user(self, user_id: str, page_number = 1, page_size = 10):
        response = self.client.table("user_llm_tokens") \
                    .select('*') \
                    .eq("user_id", user_id) \
                    .limit(page_size) \
                    .offset((page_number - 1) * page_size) \
                    .execute()
        return {
            "count": response.count,
            "page_number": page_number,
            "page_size": page_size,
            "data": [UserLLMToken(token) for token in response.data],
        }

    def create(self, llm_token: UserLLMToken):
        llm_token = self.client.table("user_llm_tokens") \
                        .insert(llm_token.model_dump(exclude=["id"])) \
                        .execute()
        return llm_token
    
    def delete(self, llm_token: UserLLMToken):
        self.client.table("user_llm_tokens") \
                    .delete() \
                    .eq("id", llm_token.id)