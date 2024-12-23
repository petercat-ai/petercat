import yaml
import fnmatch
from urllib.parse import urlparse, parse_qs

from typing import Any, List
from github import Github, Auth, GithubException
from github.PaginatedList import PaginatedList
from github.File import File
from github.PullRequest import PullRequest
from github.Repository import Repository
from agent.bot import Bot
from agent.bot.get_bot import get_bot_by_id
from core.models.bot import BotModel

from utils.fuzzy_match import contains_keyword_fuzzy
from utils.path_to_hunk import convert_patch_to_hunk
from utils.random_str import random_str
from agent.prompts.pull_request import (
    get_role_prompt,
    generate_pr_review_comment_prompt,
)
from agent.qa_chat import agent_chat
from core.dao.repositoryConfigDAO import RepositoryConfigDAO
from petercat_utils.data_class import ChatData, Message, TextContentBlock


def file_match(filename: str, patterns: List[str]):
    return any(fnmatch.fnmatch(filename, pattern) for pattern in patterns)


class PullRequestEventHandler:
    event: Any
    auth: Auth.AppAuth
    g: Github

    def __init__(self, payload: Any, auth: Auth.AppAuth, installation_id: int) -> None:
        self.event: Any = payload
        self.auth: Auth.AppAuth = auth
        self.g: Github = Github(auth=auth)

    @staticmethod
    def get_file_exclusions():
        with open("file_exclusions.yaml", "r") as file:
            config = yaml.safe_load(file)
            return config["exclusions"]

    @staticmethod
    def get_file_hunk(file: File):
        exclusions = PullRequestEventHandler.get_file_exclusions()
        if file_match(file.filename, exclusions):
            return f"adds: {file.additions}, deletions: {file.deletions}, changes: {file.changes}"

        return convert_patch_to_hunk(file.patch)

    @staticmethod
    def get_file_ref(file: File):
        parsed_url = urlparse(file.contents_url)
        query_params = parse_qs(parsed_url.query)
        return query_params.get("ref", [None])[0]

    def get_pull_request(self) -> tuple[PullRequest, PaginatedList[File], Repository]:
        repo = self.g.get_repo(self.event["repository"]["full_name"])
        pr = repo.get_pull(self.event["pull_request"]["number"])
        diff = pr.get_files()
        return pr, diff, repo

    def get_file_diff(self, diff: PaginatedList[File]) -> str:
        return "\n\n".join(
            [
                f"{file.filename}(sha: `{PullRequestEventHandler.get_file_ref(file)}`):\n{PullRequestEventHandler.get_file_hunk(file)}"
                for file in diff
            ]
        )

    async def execute(self):
        repo_full_name = self.event["repository"]["full_name"]
        repository_config = RepositoryConfigDAO()
        repo_config = repository_config.get_by_repo_name(repo_full_name)

        # 用户尚未为仓库配置承接的 CR 机器人，不做任何事情
        if repo_config is None:
            return {"success": True}

        try:
            if self.event["action"] == "opened":
                pr, diff, repo = self.get_pull_request()

                file_diff = self.get_file_diff(diff)
                role_prompt = get_role_prompt(
                    repo.full_name, pr.number, pr.title, pr.body, pr.draft
                )

                pr_content = f"""
                ### Pr Title
                {pr.title}
                ### Pr Description
                {pr.body}
                ### File Diff
                {file_diff}
                """
                origin_bot = get_bot_by_id(repo_config.robot_id)
                bot = Bot(
                    bot=BotModel(
                        id=random_str(),
                        uid="mock_pull_requst",
                        description="A Robot for Pull Requst Review",
                        name="pull_request_bot",
                        prompt=role_prompt,
                        repo_name=repo_full_name,
                    ),
                    llm_token=origin_bot.llm_token,
                )

                analysis_result = await agent_chat(
                    ChatData(
                        messages=[
                            Message(
                                role="user",
                                content=[
                                    TextContentBlock(type="text", text=pr_content)
                                ],
                            ),
                        ],
                    ),
                    self.auth,
                    bot=bot,
                )
                print(f"analysis_result={analysis_result}")
                return {"success": True}
            else:
                return {"success": True}

        except GithubException as e:
            print(f"处理 GitHub 请求时出错：{e}")
            return {"success": False, "error": str(e)}


class PullRequestReviewCommentEventHandler(PullRequestEventHandler):
    def not_mentioned_me(self):
        return "@petercat-assistant" not in self.event["comment"]["body"]

    async def execute(self):
        try:
            print(f"actions={self.event['action']},sender={self.event['sender']}")
            if self.event["sender"]["type"] == "Bot":
                return {"success": True}
            if self.event["action"] in ["created", "edited"]:
                if self.not_mentioned_me():
                    return {"success": True}

                comment_id = self.event["comment"]["id"]
                pr, diff, repo = self.get_pull_request()
                file_diff = self.get_file_diff(diff)

                pr_review_comments = pr.get_review_comments()

                messages = [
                    Message(
                        role="assistant" if comment.user.type == "Bot" else "user",
                        content=[TextContentBlock(type="text", text=comment.body)],
                    )
                    for comment in pr_review_comments
                ]

                pr_content = f"""
                ### Pr Title
                {pr.title}
                ### Pr Description
                {pr.body}
                ### File Diff
                {file_diff}
                """

                prompt = generate_pr_review_comment_prompt(
                    pr_number=pr.number,
                    pr_content=pr_content,
                )

                repository_config = RepositoryConfigDAO()
                repo_config = repository_config.get_by_repo_name(repo.full_name)
                if repo_config.robot_id:
                    bot = get_bot_by_id(repo_config.robot_id)

                    analysis_result = await agent_chat(
                        ChatData(
                            prompt=f"{bot.prompt}\n{prompt}",
                            messages=messages,
                            bot_id=repo_config.robot_id,
                        ),
                        self.auth,
                        bot,
                    )

                    pr.create_review_comment_reply(
                        comment_id, analysis_result["output"]
                    )

        except GithubException as e:
            print(f"处理 GitHub 请求时出错：{e}")
            return {"success": False, "error": str(e)}
