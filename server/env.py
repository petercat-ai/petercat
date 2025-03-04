# list all env variables
from utils.env import get_env_variable


WEB_URL = get_env_variable("WEB_URL")
ENVIRONMENT = get_env_variable("PETERCAT_ENV", "development")
API_URL = get_env_variable("API_URL")
