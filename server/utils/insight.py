import requests
from collections import defaultdict


def get_data(repo_name, metrics_mapping):
    """
    :param repo_name: GitHub 仓库名
    :param metrics_mapping: 指标名称与聚合类型的映射字典
    :return: 按年、季度、月聚合的数据字典
    """
    base_url = f"https://oss.open-digger.cn/github/{repo_name}/"

    aggregated_data = {
        "year": defaultdict(
            lambda: {metric_type: 0 for metric_type in metrics_mapping.values()}
        ),
        "quarter": defaultdict(
            lambda: {metric_type: 0 for metric_type in metrics_mapping.values()}
        ),
        "month": defaultdict(
            lambda: {metric_type: 0 for metric_type in metrics_mapping.values()}
        ),
    }

    for metric, metric_type in metrics_mapping.items():
        url = f"{base_url}{metric}.json"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            for date, value in data.items():
                if "-" in date:
                    year, month = date.split("-")[:2]
                    quarter = f"{year}Q{(int(month) - 1) // 3 + 1}"

                    # aggregate by year, quarter, and month
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
