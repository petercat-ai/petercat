from utils.insight import get_data


def get_pr_data(repo_name):
    metrics_mapping = {
        "change_requests": "open",
        "change_requests_accepted": "merge",
        "change_requests_reviews": "reviews",
    }
    return get_data(repo_name, metrics_mapping)


def get_code_frequency(repo_name):
    metrics_mapping = {
        "code_change_lines_add": "add",
        "code_change_lines_remove": "remove",
    }
    data = get_data(repo_name, metrics_mapping)

    def process_entries(entries):
        """Convert 'remove' entries to negative values."""
        return [
            {**entry, "value": -entry["value"]} if entry["type"] == "remove" else entry
            for entry in entries
        ]

    for key in ["year", "quarter", "month"]:
        if key in data:
            data[key] = process_entries(data[key])

    return data
