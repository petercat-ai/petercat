PULL_REQUEST_SUMMARY = """
# Task
You have required to summarize the pullrequest diff.
Provider your response in markdown with the following content
- **Walkthrough**:  A high-level summary of the overall change instead of specific files within 80 words.
- **Changes**: A markdown table of files and their summaries. Group files with similar changes together into a single row to save space.


## File Diff
{file_diff}

# Constraints:
- Summary should include a note about alterations to functions, datastructures and variables
- All outputs MUST ALWAYS follow the user's language.
"""

def get_pr_summary(file_diff: str):
  return PULL_REQUEST_SUMMARY.format(file_diff=file_diff)