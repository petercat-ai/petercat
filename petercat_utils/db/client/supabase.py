from supabase.client import Client, create_client
from ...utils.env import get_env_variable

supabase_url = get_env_variable("SUPABASE_URL")
supabase_key = get_env_variable("SUPABASE_SERVICE_KEY")

def get_client():
    supabase: Client = create_client(supabase_url, supabase_key)
    return supabase
