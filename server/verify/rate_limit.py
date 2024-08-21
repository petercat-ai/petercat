from typing import Annotated
from fastapi import Cookie, HTTPException
from datetime import datetime, timedelta

from auth.get_user_info import getUserInfoByToken
from petercat_utils import get_client, get_env_variable

RATE_LIMIT_ENABLED = get_env_variable("RATE_LIMIT_ENABLED", "False") == 'True'
RATE_LIMIT_REQUESTS = get_env_variable("RATE_LIMIT_REQUESTS") or 100
RATE_LIMIT_DURATION = timedelta(minutes=int(get_env_variable("RATE_LIMIT_DURATION") or 1))

async def verify_rate_limit(petercat_user_token: Annotated[str | None, Cookie()] = None):
    if not RATE_LIMIT_ENABLED:
        return

    if not petercat_user_token:
        raise HTTPException(status_code=403, detail="Must Login")
    user = await getUserInfoByToken(petercat_user_token)

    if user is None:
        raise HTTPException(
            status_code=429, 
            detail="Rate Limit Exceeded, Try It Later",
            headers={"Retry-After": "60"}
        )
    user_id = user["id"]
    supabase = get_client()
    table = supabase.table("user_token_usage")
    rows = table.select('id, user_id, last_request, request_count').eq('user_id', user_id).execute()

    now = datetime.now().isoformat()
    user_usage = rows.data[0] if len(rows.data) > 0 else { "user_id": user_id, 'request_count': 0, 'last_request': now }

    # Calculate the time elapsed since the last request
    elapsed_time = datetime.now() - datetime.fromisoformat(user_usage["last_request"])
    
    if elapsed_time > RATE_LIMIT_DURATION:
        # If the elapsed time is greater than the rate limit duration, reset the count
        user_usage['request_count'] = 1
    else:
        if user_usage['request_count'] >= int(RATE_LIMIT_REQUESTS):
            # If the request count exceeds the rate limit, return a JSON response with an error message
            raise HTTPException(
                status_code=429, 
                detail="Rate Limit Exceeded, Try It Later",
                headers={"Retry-After": "60"}
            )

        user_usage['request_count'] = int(user_usage['request_count']) + 1
    
    user_usage['last_request'] = datetime.now().isoformat()

    table.upsert(user_usage).execute()

    return user
