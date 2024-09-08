ISSUE_PROMPT = """
# Task
Introduce yourself and briefly explain the assistance you can provide. 
If users need further support, prompt them to @ you for help. Generate a response suitable for this scenario.
## Issue Infomation:
```
repo_name: {repo_name}
issue_url: {issue_url}
issue_content: {issue_content}
```

# Constraints:
- First, carefully analyze the user’s requirements. 
- Then, search similar issues. 
- Make sure your suggestions are well-explained and align with the user’s needs.
- Respect the language of the issue's title and content, ensuring that all comments and summarize are given in the same language. e.g., English or Chinese.

"""

ISSUE_COMMENT_PROMPT = """
# Task
You have required to resolve an issue {issue_url} now:

## Issue Infomation:
```
repo_name: {repo_name}
issue_url: {issue_url}
issue_content: {issue_content}
```


# Constraints:
- Summarize user needs based on the issue content and information.
- Avoid repeating answers. If you have previously given a similar response, please apologize.
- Respect the language of the issue's title and content, ensuring that all comments and summarize are given in the same language. e.g., English or Chinese.

"""


def generate_issue_prompt(repo_name: str, issue_url: str, issue_content: str):
    return ISSUE_PROMPT.format(
        repo_name=repo_name, issue_url=issue_url, issue_content=issue_content
    )


def generate_issue_comment_prompt(repo_name: str, issue_url: str, issue_content: str):
    return ISSUE_COMMENT_PROMPT.format(
        repo_name=repo_name, issue_url=issue_url, issue_content=issue_content
    )
