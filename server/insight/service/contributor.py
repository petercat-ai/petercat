import requests
import re
from collections import defaultdict


def get_contributor_data(repo_name):
    url = f"https://oss.open-digger.cn/github/{repo_name}/contributors.json"

    pattern_year = re.compile(r"^\d{4}$")
    pattern_quarter = re.compile(r"^\d{4}Q\d$")
    pattern_month = re.compile(r"^\d{4}-\d{2}$")

    try:
        response = requests.get(url)
        data = response.json()

        if not data:
            return {"year": [], "quarter": [], "month": []}

        year_data = defaultdict(int)
        quarter_data = defaultdict(int)
        month_data = defaultdict(int)

        for date, value in data.items():
            if pattern_year.match(date):
                year_data[date] += value
            elif pattern_quarter.match(date):
                quarter_data[date] += value
            elif pattern_month.match(date):
                month_data[date] += value

        year_result = [
            {"date": year, "value": value} for year, value in year_data.items()
        ]
        quarter_result = [
            {"date": quarter, "value": value} for quarter, value in quarter_data.items()
        ]
        month_result = [
            {"date": month, "value": value} for month, value in month_data.items()
        ]

        return {
            "year": sorted(year_result, key=lambda x: x["date"]),
            "quarter": sorted(quarter_result, key=lambda x: x["date"]),
            "month": sorted(month_result, key=lambda x: x["date"]),
        }

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return {"year": [], "quarter": [], "month": []}
