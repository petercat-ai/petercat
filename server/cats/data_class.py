from pydantic import BaseModel


class GitIssueConfig(BaseModel):
    repo_name: str
    issue_id: str


class RAGIssueDocConfig(GitIssueConfig):
    bot_id: str
