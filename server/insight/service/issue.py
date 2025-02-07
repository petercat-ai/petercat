import re
import requests
from utils.insight import get_data


def get_issue_data(repo_name):
    metrics_mapping = {
        "issues_new": "open",
        "issues_closed": "close",
        "issue_comments": "comment",
    }
    issue_data = get_data(repo_name, metrics_mapping)
    return issue_data


def get_issue_resolution_duration(repo_name):
    url = (
        f"https://oss.open-digger.cn/github/{repo_name}/issue_resolution_duration.json"
    )
    try:
        response = requests.get(url)
        data = response.json()

        quantile_keys = [
            "quantile_0",
            "quantile_1",
            "quantile_2",
            "quantile_3",
            "quantile_4",
        ]
        quantile_data = {k: v for k, v in data.items() if k in quantile_keys}

        all_time_keys = set()
        for qk in quantile_data:
            all_time_keys.update(quantile_data[qk].keys())

        year_pattern = re.compile(r"^\d{4}$")
        quarter_pattern = re.compile(r"^\d{4}Q[1-4]$")
        month_pattern = re.compile(r"^\d{4}-\d{2}$")

        result = {"year": [], "quarter": [], "month": []}

        for key in all_time_keys:
            values = [quantile_data[qk].get(key, 0) for qk in quantile_keys]

            if year_pattern.match(key):
                result["year"].append({"date": key, "value": values})
            elif quarter_pattern.match(key):
                result["quarter"].append({"date": key, "value": values})
            elif month_pattern.match(key):
                result["month"].append({"date": key, "value": values})

        result["year"].sort(key=lambda x: int(x["date"]))

        result["quarter"].sort(key=lambda x: (int(x["date"][:4]), int(x["date"][-1])))

        result["month"].sort(key=lambda x: tuple(map(int, x["date"].split("-"))))

        return result
    except Exception as e:
        print(e)
        return []
