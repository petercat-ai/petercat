from typing import Optional

from github import Github
from core.dao.repositoryConfigDAO import RepositoryConfigDAO
from petercat_utils import get_client
from github import Github, Auth


def query_list(
    name: Optional[str] = None,
    user_id: Optional[str] = None,
    access_token: Optional[str] = None,
    personal: Optional[str] = None,
):
    try:
        supabase = get_client()
        query = (
            supabase.rpc("get_bots_with_profiles_and_github")
            if personal == "true"
            else supabase.table("bots").select(
                "id, created_at, updated_at, avatar, description, name, public, starters, uid, repo_name"
            )
        )
        if name:
            query = query.filter("name", "like", f"%{name}%")

        if personal == "true":
            if not access_token or not user_id:
                return {"data": [], "personal": personal}

            auth = Auth.Token(token=access_token)
            github_user = Github(auth=auth).get_user()
            orgs_ids = [org.id for org in github_user.get_orgs()]
            bot_ids = []

            repository_config_dao = RepositoryConfigDAO()
            bots = repository_config_dao.query_bot_id_by_owners(
                orgs_ids + [github_user.id]
            )

            if bots:
                bot_ids = [bot["robot_id"] for bot in bots if bot["robot_id"]]

            or_clause = f"uid.eq.{user_id}" + (
                f",id.in.({','.join(map(str, bot_ids))})" if bot_ids else ""
            )
            query = query.or_(or_clause)
        else:
            query = query.eq("public", True)

        query = query.order("updated_at", desc=True)
        data = query.execute()
        if data.data:
            unique_data = {}
            for item in data.data:
                unique_data[item["id"]] = item
            deduplicated_list = list(unique_data.values())
            return deduplicated_list
        return data.data
    except Exception as e:
        print(f"query list error: {e}")
