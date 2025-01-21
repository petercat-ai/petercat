from utils.insight import get_data


def get_issue_data(repo_name):
    metrics_mapping = {
        "issues_new": "open",
        "issues_closed": "close",
        "issue_comments": "comment",
    }
    issue_data = get_data(repo_name, metrics_mapping)
    return issue_data
