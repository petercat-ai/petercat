from utils.insight import get_data


def get_pr_data(repo_name):
    metrics_mapping = {
        "change_requests": "open",
        "change_requests_accepted": "merge",
        "change_requests_reviews": "reviews",
    }
    return get_data(repo_name, metrics_mapping)


def get_code_changes(repo_name):
    metrics_mapping = {
        "code_change_lines_add": "add",
        "code_change_lines_remove": "remove",
    }
    return get_data(repo_name, metrics_mapping)
