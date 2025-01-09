from core.config import Settings
from interface.db_plugin_interface import DBPluginInterface

from supabase.client import Client, create_client


class SupaBasePlugin(DBPluginInterface):
    client = None

    def __init__(self, settings: Settings):
        supabase: Client = create_client(
            settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY
        )
        self.client = supabase

    def getBotById(self, botId: int):
        response = self.client.table("bots").select("*").eq("id", botId).execute()
        return response
