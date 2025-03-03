from datetime import datetime
from supabase.client import Client

from core.models.user_token_usage import (
    BotTokenUsageRate,
    BotTokenUsageStats,
    UserTokenUsage,
    UserTokenUsageRate,
    UserTokenUsageStats,
)
from core.dao.BaseDAO import BaseDAO
from utils.supabase import get_client


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
        resp = self.client.rpc(
            "get_user_stats",
            {
                "filter_user_id": user_id,
                "start_date": start_date.strftime("%Y-%m-%d"),
                "end_date": end_date.strftime("%Y-%m-%d"),
            },
        ).execute()

        return [UserTokenUsageStats(**stats) for stats in resp.data]

    def analyze(self, start_date: datetime, end_date: datetime):
        resp = self.client.rpc(
            "analyze_user_token_usage",
            {
                "start_date": start_date.strftime("%Y-%m-%d"),
                "end_date": end_date.strftime("%Y-%m-%d"),
            },
        ).execute()

        return [BotTokenUsageStats(**stats) for stats in resp.data]

    def top_bots(self, start_date: datetime, end_date: datetime):
        resp = self.client.rpc(
            "bot_token_usage_rate",
            {
                "start_date": start_date.strftime("%Y-%m-%d"),
                "end_date": end_date.strftime("%Y-%m-%d"),
            },
        ).execute()

        return [BotTokenUsageRate(**stats) for stats in resp.data]

    def top_users(self, start_date: datetime, end_date: datetime):
        resp = self.client.rpc(
            "user_token_usage_rate",
            {
                "start_date": start_date.strftime("%Y-%m-%d"),
                "end_date": end_date.strftime("%Y-%m-%d"),
            },
        ).execute()

        return [UserTokenUsageRate(**stats) for stats in resp.data]
