from supabase.client import Client

from petercat_utils.db.client.supabase import get_client

from ..dao.BaseDAO import BaseDAO
from ..models.authorization import Authorization

class AuthorizationDAO(BaseDAO):
    client: Client

    def __init__(self):
        super().__init__()
        self.client = get_client()

    def exists(self, installation_id: str) -> bool:
        try:
            authorization = self.client.table("github_app_authorization")\
                .select('*', count="exact")\
                .eq('installation_id', installation_id) \
                .execute()

            return bool(authorization.count)

        except Exception as e:
            print("Error: ", e)
            return {"message": "User creation failed"}

    def create(self, data: Authorization):
        print('supabase github_app_authorization creation', data.model_dump())
        try:
            authorization = self.client.from_("github_app_authorization")\
                    .insert(data.model_dump())\
                    .execute()
            if authorization:
                return True, {"message": "User created successfully"}
            else:
                return False, {"message": "User creation failed"}
        except Exception as e:
            print("Error: ", e)
            return False, {"message": "User creation failed"}