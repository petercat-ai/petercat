import requests
import re
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


def get_active_dates_and_times(repo_name: str):
    url = f"https://oss.open-digger.cn/github/{repo_name}/active_dates_and_times.json"
    try:
        resp = requests.get(url)
        resp.raise_for_status()
        data = resp.json()

        pattern_year = re.compile(r"^\d{4}$")  # e.g. "2024"
        pattern_quarter = re.compile(r"^\d{4}Q[1-4]$")  # e.g. "2024Q3"
        pattern_month = re.compile(r"^\d{4}-\d{2}$")  # e.g. "2024-08"

        years = []
        quarters = []
        months = []

        for k in data.keys():
            if pattern_year.match(k):
                years.append(k)
            elif pattern_quarter.match(k):
                quarters.append(k)
            elif pattern_month.match(k):
                months.append(k)

        def safe_get_latest(lst):
            return sorted(lst)[-1] if lst else None

        latest_year_key = safe_get_latest(years)
        latest_quarter_key = safe_get_latest(quarters)
        latest_month_key = safe_get_latest(months)

        def convert_168_to_day_hour_value(arr_168):
            if not arr_168:
                return []

            day_map = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            result = []
            for i, value in enumerate(arr_168):
                day_index = i // 24
                hour = i % 24
                result.append({"day": day_map[day_index], "hour": hour, "value": value})
            return result

        year_data = (
            convert_168_to_day_hour_value(data[latest_year_key])
            if latest_year_key
            else []
        )
        quarter_data = (
            convert_168_to_day_hour_value(data[latest_quarter_key])
            if latest_quarter_key
            else []
        )
        month_data = (
            convert_168_to_day_hour_value(data[latest_month_key])
            if latest_month_key
            else []
        )

        result = {"year": year_data, "quarter": quarter_data, "month": month_data}

        return result
    except Exception as e:
        print(e)
        return []
