from datetime import datetime
from supabase.client import Client

from core.models.user_token_usage import BotTokenUsageStats, UserTokenUsage, UserTokenUsageStats
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
    
            
    def stats(self, user_id: str, start_date: datetime, end_date: datetime):
        resp = self.client.rpc("get_user_stats", {
            "filter_user_id": user_id,
            "start_date": start_date.strftime("%Y-%m-%d"),
            "end_date": end_date.strftime("%Y-%m-%d"),
        }).execute()

        return [UserTokenUsageStats(**stats) for stats in resp.data]

    def analyze(self, start_date: datetime, end_date: datetime):
        resp = self.client.rpc("analyze_user_token_usage", {
            "start_date": start_date.strftime("%Y-%m-%d"),
            "end_date": end_date.strftime("%Y-%m-%d"),
        }).execute()

        return [BotTokenUsageStats(**stats) for stats in resp.data]