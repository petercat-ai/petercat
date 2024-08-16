import httpx
from petercat_utils import get_env_variable

AUTH0_DOMAIN = get_env_variable("AUTH0_DOMAIN")

API_AUDIENCE = get_env_variable("API_IDENTIFIER")
CLIENT_ID = get_env_variable("AUTH0_CLIENT_ID")
CLIENT_SECRET = get_env_variable("AUTH0_CLIENT_SECRET")

async def get_oauth_token():
    url = f'https://{AUTH0_DOMAIN}/oauth/token'
    headers = {"content-type": "application/x-www-form-urlencoded"}
    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'audience': API_AUDIENCE,
        'grant_type': 'client_credentials'
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, data=data, headers=headers)
        print(f"url={url}, response={response}")
        return response.json()['access_token']