
import json
from dao.BaseDAO import BaseDAO
from models.authorization import Authorization
from supabase.client import Client, create_client

from models.bot import Bot
from petercat_utils.db.client.supabase import get_client

class BotDAO(BaseDAO):
  client: Client

  def __init__(self):
      super().__init__()
      self.client = get_client()

  def get_bot(self, bot_id: str):
    resp = self.client.table("bots")\
      .select("*") \
      .eq("id", bot_id) \
      .execute()
    bot = resp.data[0]
    return Bot(**resp.data[0])