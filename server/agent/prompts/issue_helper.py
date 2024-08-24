ISSUE_PROMPT = """
# Task
You have required to resolve an issue {issue_url} now:

## Issue Content:
{issue_content}

# Constraints:
First, carefully analyze the user’s requirements. 
Then, search similar issues. 
Make sure your suggestions are well-explained and align with the user’s needs.

"""

ISSUE_COMMENT_PROMPT = """
# Task
You have required to resolve an issue {issue_url} now:

## Issue Content:
{issue_content}

# Constraints:
- Summarize user needs based on the issue content and information.
- Avoid repeating answers. If you have previously given a similar response, please apologize.

"""

def generate_issue_prompt(issue_url: str, issue_content: str):
    return ISSUE_PROMPT.format(issue_url=issue_url, issue_content=issue_content)

def generate_issue_comment_prompt(issue_url: str, issue_content: str):
    return ISSUE_COMMENT_PROMPT.format(issue_url=issue_url, issue_content=issue_content)

