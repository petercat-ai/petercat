from core.dao.BaseDAO import BaseDAO
from core.models.bot_approval import BotApproval
from supabase.client import Client

from utils.supabase import get_client



class BotApprovalDAO(BaseDAO):
    client: Client

    def __init__(self):
        super().__init__()
        self.client = get_client()

    def create(self, data: BotApproval):
        try:
            bot_approval = (
                self.client.table("bot_approval")
                .insert(data.model_dump(exclude=["id"]))
                .execute()
            )
            if bot_approval:
                return True, {"message": "approval created successfully"}
            else:
                return False, {"message": "approval creation failed"}
        except Exception as e:
            print("Error: ", e)
            return False, {"message": "approval creation failed"}

    def query_by_id_status(self, bot_id: str, status: str):
        try:
            bot_approval = (
                self.client.table("bot_approval")
                .select("*")
                .eq("bot_id", bot_id)
                .eq("approval_status", status)
                .execute()
            )
            if bot_approval:
                return True, bot_approval.data
            else:
                return False, {"message": "approval query failed"}
        except Exception as e:
            print("Error: ", e)
            return False, {"message": "approval query failed"}

    def update_approval_status(self, id: str, status: str):
        try:
            bot_approval = (
                self.client.table("bot_approval")
                .update({"approval_status": status})
                .eq("id", id)
                .execute()
            )
            if bot_approval:
                return True, {"message": "approval updated successfully"}
            else:
                return False, {"message": "approval update failed"}
        except Exception as e:
            print("Error: ", e)
            return False, {"message": "approval update failed"}
