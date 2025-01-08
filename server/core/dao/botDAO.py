from core.dao.BaseDAO import BaseDAO
from supabase.client import Client

from core.models.bot import BotModel
from petercat_utils.db.client.supabase import get_client


class BotDAO(BaseDAO):
    client: Client

    def __init__(self):
        super().__init__()
        self.client = get_client()

    def get_bot(self, bot_id: str):
        resp = self.client.table("bots").select("*").eq("id", bot_id).execute()
        bot = resp.data[0]
        return BotModel(**bot)

    def update_bot(self, bot_id: str, data: dict):
        resp = self.client.table("bots").update(data).eq("id", bot_id).execute()
        return resp
