import requests
from collections import defaultdict


def get_issue_data(repo_name):
    metrics_mapping = {
        "issues_new": "open",
        "issues_closed": "close",
        "issue_comments": "comment",
    }

    base_url = f"https://oss.open-digger.cn/github/{repo_name}/"

    aggregated_data = {
        "year": defaultdict(lambda: {"open": 0, "close": 0, "comment": 0}),
        "quarter": defaultdict(lambda: {"open": 0, "close": 0, "comment": 0}),
        "month": defaultdict(lambda: {"open": 0, "close": 0, "comment": 0}),
    }

    for metric, metric_type in metrics_mapping.items():
        url = f"{base_url}{metric}.json"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            for date, value in data.items():
                if "-" in date:  # 只处理日期数据
                    year, month = date.split("-")[:2]
                    quarter = f"{year}Q{(int(month) - 1) // 3 + 1}"

                    # 按年度、季度、月度分别聚合
                    aggregated_data["year"][year][metric_type] += value
                    aggregated_data["quarter"][quarter][metric_type] += value
                    aggregated_data["month"][date][metric_type] += value
        else:
            print(
                f"Error fetching data from {url} (status code: {response.status_code})"
            )

    def format_result(data):
        result = []
        for date, counts in data.items():
            for type_, value in counts.items():
                result.append({"type": type_, "date": date, "value": value})
        return result

    return {
        "year": format_result(aggregated_data["year"]),
        "quarter": format_result(aggregated_data["quarter"]),
        "month": format_result(aggregated_data["month"]),
    }
