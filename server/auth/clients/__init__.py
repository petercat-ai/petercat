from auth.clients.auth0 import Auth0Client
from auth.clients.base import BaseAuthClient
from auth.clients.local import LocalClient

from utils.env import get_env_variable

PETERCAT_AUTH0_ENABLED = get_env_variable("PETERCAT_AUTH0_ENABLED", "True") == "True"

def get_auth_client() -> BaseAuthClient:
  if PETERCAT_AUTH0_ENABLED:
    return Auth0Client()
  return LocalClient()
