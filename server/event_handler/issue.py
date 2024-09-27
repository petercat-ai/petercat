from typing import Any, Tuple
from github import Github, Auth
from github.Issue import Issue
from github.Repository import Repository
from github import GithubException
from agent.bot.get_bot import get_bot_by_id
from agent.prompts.issue_helper import (
    generate_issue_comment_prompt,
    generate_issue_prompt,
)

from core.dao.repositoryConfigDAO import RepositoryConfigDAO
from petercat_utils.data_class import ChatData, Message, TextContentBlock

from agent.qa_chat import agent_chat


class IssueEventHandler:
    event: Any
    auth: Auth.AppAuth
    g: Github

    def __init__(self, payload: Any, auth: Auth.AppAuth, installation_id: int) -> None:
        self.event: Any = payload
        self.auth: Auth.AppAuth = auth
        self.g: Github = Github(auth=auth)

    def get_issue(self) -> Tuple[Issue, Repository]:
        repo_name = self.event["repository"]["full_name"]
        issue_number = self.event["issue"]["number"]
        repo = self.g.get_repo(repo_name)
        # GET ISSUES
        issue = repo.get_issue(number=issue_number)
        return issue, repo

    async def execute(self):
        try:
            action = self.event["action"]
            if self.event["sender"]["type"] == "Bot":
                return {"success": True}
            if action in ["opened", "reopened"]:
                issue, repo = self.get_issue()

                prompt = generate_issue_prompt(
                    repo_name=repo.full_name,
                    issue_url=issue.url,
                    issue_number=issue.number,
                    issue_content=issue.body,
                )
                issue_content = f"{issue.title}: {issue.body}"
                message = Message(
                    role="user",
                    content=[TextContentBlock(type="text", text=issue_content)],
                )

                repository_config = RepositoryConfigDAO()
                repo_config = repository_config.get_by_repo_name(repo.full_name)
                bot = get_bot_by_id(repo_config.robot_id)

                analysis_result = await agent_chat(
                    ChatData(
                        prompt=prompt, messages=[message], bot_id=repo_config.robot_id
                    ),
                    self.auth,
                    bot,
                )

                issue.create_comment(analysis_result["output"])

                return {"success": True}
        except GithubException as e:
            print(f"处理 GitHub 请求时出错：{e}")
            return {"success": False, "error": str(e)}


class IssueCommentEventHandler(IssueEventHandler):
    def not_mentioned_me(self):
        return "@petercat-bot" not in self.event["comment"]["body"]

    async def execute(self):
        try:
            print(f"actions={self.event['action']},sender={self.event['sender']}")
            # 忽略机器人回复
            if self.event["sender"]["type"] == "Bot":
                return {"success": True}
            if self.event["action"] == "created":
                # 如果没有 AT 我。就算了
                if self.not_mentioned_me():
                    return {"success": True}

                issue, repo = self.get_issue()
                issue_comments = issue.get_comments()

                messages = [
                    Message(
                        role="assistant" if comment.user.type == "Bot" else "user",
                        content=[TextContentBlock(type="text", text=comment.body)],
                    )
                    for comment in issue_comments
                ]

                issue_content = f"{issue.title}: {issue.body}"
                prompt = generate_issue_comment_prompt(
                    repo_name=repo.full_name,
                    issue_url=issue.url,
                    issue_content=issue_content,
                )

                repository_config = RepositoryConfigDAO()
                repo_config = repository_config.get_by_repo_name(repo.full_name)
                if repo_config.robot_id:
                    bot = get_bot_by_id(repo_config.robot_id)

                    analysis_result = await agent_chat(
                        ChatData(
                            prompt=prompt,
                            messages=messages,
                            bot_id=repo_config.robot_id,
                        ),
                        self.auth,
                        bot,
                    )

                    issue.create_comment(analysis_result["output"])

        except GithubException as e:
            print(f"处理 GitHub 请求时出错：{e}")
            return {"success": False, "error": str(e)}
