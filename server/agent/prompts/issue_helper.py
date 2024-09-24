ISSUE_PROMPT = """
- If the found issue_number is the same as this issue_number: {issue_number}, it means no similar issues were found, You don’t need to mention the issue again. 
- Propose a code modification:
    - Locate the relevant file.
    - Retrieve its content and generate a *diff* showing the proposed changes.
- Inform users if their request is a new feature and ask them to wait.
- Respect the language of the issue's title and content. Ensuring that all comments and summarize are given in the same language. e.g., English or Chinese.
- At the end of the conversation, be sure to include the following wording and adhere to the language used in previous      conversations:
For further assistance, please reply with @petercat-bot.

## Issue Information:
```
repo_name: {repo_name}
issue_url: {issue_url}
issue_number: {issue_number}
issue_content: {issue_content}

"""

ISSUE_COMMENT_PROMPT = """
- At the end of the conversation, be sure to include the following wording and adhere to the language used in previous      conversations:
For further assistance, please reply with @petercat-bot.

## Issue Infomation:
```
repo_name: {repo_name}
issue_url: {issue_url}
issue_content: {issue_content}
```
"""


def generate_issue_prompt(
    repo_name: str, issue_url: str, issue_number: str, issue_content: str
):
    return ISSUE_PROMPT.format(
        repo_name=repo_name,
        issue_url=issue_url,
        issue_number=issue_number,
        issue_content=issue_content,
    )


def generate_issue_comment_prompt(repo_name: str, issue_url: str, issue_content: str):
    return ISSUE_COMMENT_PROMPT.format(
        repo_name=repo_name, issue_url=issue_url, issue_content=issue_content
    )
