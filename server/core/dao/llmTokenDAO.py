import logging

from typing import Optional
from core.dao.BaseDAO import BaseDAO
from supabase.client import Client
from petercat_utils.db.client.supabase import get_client
from core.models.llm_token import LLMToken

logger = logging.getLogger()
logger.setLevel("INFO")

class LLMTokenDAO(BaseDAO):
    client: Client

    def __init__(self):
        super().__init__()
        self.client = get_client()

    def get_llm_token(self, llm: Optional[str | None] = None, free: Optional[bool | None] = None) -> LLMToken:
        query = self.client.table("llm_tokens") \
                    .select('*')
        if llm is not None:
            query = query.eq("llm", llm)

        if free:
            query = query.eq("free", free)
        
        response = query.execute()

        if not response.data or not response.data[0]:
            return []
        
        return LLMToken(**response.data[0])