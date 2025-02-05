import requests
from typing import List, Dict


def get_activity_data(repo_name: str) -> List[Dict[str, int]]:
    url = f"https://oss.open-digger.cn/github/{repo_name}/activity_details.json"

    try:
        response = requests.get(url)
        data = response.json()
        if not data:
            return []

        # Filter out only the monthly data (excluding quarters)
        monthly_data = {k: v for k, v in data.items() if "-" in k}

        # Get the most recent month
        most_recent_month_key = max(monthly_data.keys())

        # Return the data for the most recent month
        return [
            {"user": user, "value": value}
            for user, value in monthly_data[most_recent_month_key]
        ]
    except Exception as e:
        print(e)
        return []
