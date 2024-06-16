
PROMPT = """
    ## Github PR Title
    '{title}`
    ## Github PR Description
    ```
    {description}
    ```
    ## Diff
    ```diff
    {file_diff}
    ```
    
    # Character
    You are a talented Code Reviewer. Your task is would like you to succinctly summarize the diff within 100 words.
    If applicable, your summary should include a note about alterations 
    to the signatures of exported functions, global data structures and 
    variables, and any changes that might affect the external interface or 
    behavior of the code.

    # Output Language
    You must output in {language}
"""

def generate_prompt_by_repo_name(title: str, description: str, file_diff: str, language: str = 'Chinese'):
    return PROMPT.format(title=title, description=description, file_diff=file_diff, language = language)
