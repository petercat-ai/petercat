from core.dao.BaseDAO import BaseDAO
from supabase.client import Client

from utils.supabase import get_client

class ProfilesDAO(BaseDAO):
    client: Client

    def __init__(self):
        super().__init__()
        self.client = get_client()

    def get_profile(self, user_id: str):
        resp = (
            self.client.table("profiles")
            .select('id, is_admin, agreement_accepted')
            .eq('id', user_id)
            .execute()
        )
        return resp.data[0] if resp.data else None

    def upsert_user(self, user_data: dict):

        resp = (
            self.client.table("profiles")
            .upsert(user_data)
            .execute()
        )
        return resp.data

    def get_agreement_status(self, user_id: str):
        resp = (
            self.client.table("profiles")
            .select("agreement_accepted")
            .eq("id", user_id)
            .execute()
        )
        agreement_accepted = resp.data[0]
        return agreement_accepted

    def accept_agreement(self, user_id: str):
        try:
            response = (
                self.client.table("profiles")
                .update({"agreement_accepted": True})
                .match({"id": user_id})
                .execute()
            )

            if not response.data:
                return False, {"message": "User does not exist, accept failed."}
            return response.data[0]
        except Exception as e:
            print("Error: ", e)
            return False, {"message": "Profile Update failed"}
