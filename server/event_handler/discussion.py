import requests
from typing import Any, Tuple
from github import Github, Auth
from github import GithubException
from agent.bot.get_bot import get_bot_by_id
from core.dao.repositoryConfigDAO import RepositoryConfigDAO
from petercat_utils.data_class import ChatData, Message, TextContentBlock
from agent.prompts.issue_helper import (
    generate_issue_comment_prompt,
    generate_issue_prompt,
)


from agent.qa_chat import agent_chat


class DiscussionEventHandler:
    event: Any
    auth: Auth.AppAuth
    installation_id: int
    g: Github
    graph_url: str

    def __init__(self, payload: Any, auth: Auth.AppAuth, installation_id: int) -> None:
        self.event: Any = payload
        self.auth: Auth.AppAuth = auth
        self.installation_id = installation_id
        self.g: Github = Github(auth=auth)
        self.graph_url = "https://api.github.com/graphql"

    async def get_discussion_id(self, owner: str, repo: str, discussion_number: int):
        access_token = self.auth.token
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/vnd.github.v3+json",
        }
        query = """
        query($owner: String!, $repo: String!, $discussionNumber: Int!) {
            repository(owner: $owner, name: $repo) {
                discussion(number: $discussionNumber) {
                    id
                }
            }
        }
        """
        variables = {
            "owner": owner,
            "repo": repo,
            "discussionNumber": discussion_number,
        }
        json_data = {"query": query, "variables": variables}
        response = requests.post(self.graph_url, headers=headers, json=json_data)

        if response.status_code == 200:
            print("获取讨论成功！")
            return response.json()["data"]["repository"]["discussion"]["id"]
        else:
            print(f"出现错误：{response.status_code}")
            print(response.json())

    async def create_discussion_comment(self, discussion_id: int, comment_body: str):
        access_token = self.auth.token
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/vnd.github.v3+json",
        }
        query = """
        mutation($discussionId: ID!, $body: String!) {
            addDiscussionComment(input: {discussionId: $discussionId, body: $body}) {
                comment {
                    id
                    body
                    createdAt
                }
            }
        }
        """
        variables = {"discussionId": discussion_id, "body": comment_body}

        json_data = {"query": query, "variables": variables}
        response = requests.post(self.graph_url, headers=headers, json=json_data)

        if response.status_code == 200:
            print("评论创建成功！")
        else:
            print(f"出现错误：{response.status_code}")
            print(response.json())

    async def handle_discussion_event(self, action: str):
        owner = self.event["organization"]["login"]
        repo_name = self.event["repository"]["full_name"]
        discussion = self.event["discussion"]
        discussion_content = f"{discussion['title']}: {discussion['body']}"
        text_block = TextContentBlock(type="text", text=discussion_content)
        discussion_number = discussion["number"]
        message = Message(role="user", content=[text_block])
        repository_config = RepositoryConfigDAO()
        repo_config = repository_config.get_by_repo_name(repo_name)

        prompt = generate_issue_prompt(
            repo_name=repo_name,
            issue_url=discussion.html_url,
            issue_number=discussion.number,
            issue_content=discussion.body,
        )

        bot = get_bot_by_id(repo_config.robot_id)

        analysis_result = await agent_chat(
            ChatData(
                prompt=prompt,
                messages=[message],
                bot_id=repo_config.robot_id,
            ),
            self.auth,
            bot,
        )
        discussion_id = await self.get_discussion_id(
            owner, self.event["repository"]["name"], discussion_number
        )
        await self.create_discussion_comment(discussion_id, analysis_result["output"])

    async def execute(self):
        try:
            action = self.event["action"]
            if action in ["opened", "created"]:
                await self.handle_discussion_event(action)
                return {"success": True}
            else:
                print(f"不支持的 action: {action}")
                return {"success": False, "message": f"Unsupported action: {action}"}

        except GithubException as e:
            print(f"处理 GitHub 请求时出错： {e}")
            return {"success": False, "error": str(e)}


class DiscussionCommentEventHandler(DiscussionEventHandler):
    def not_mentioned_me(self):
        return "@petercat-bot" not in self.event["comment"]["body"]

    def get_comments(self, owner: str, repo: str, discussion_number: int):
        access_token = self.auth.token
        query = """
        query($owner: String!, $repo: String!, $discussion_number: Int!, $cursor: String) {
        repository(owner: $owner, name: $repo) {
            discussion(number: $discussion_number) {
            comments(first: 100, after: $cursor) {
                edges {
                node {
                    id
                    body
                    author {
                    login
                    }
                    createdAt
                }
                }
                pageInfo {
                endCursor
                hasNextPage
                }
            }
            }
        }
        }
        """

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/vnd.github.v3+json",
        }
        variables = {
            "owner": owner,
            "repo": repo,
            "discussion_number": discussion_number,
            "cursor": None,
        }

        comments = []
        has_next_page = True
        cursor = None

        while has_next_page:
            variables["cursor"] = cursor
            json_data = {"query": query, "variables": variables}
            response = requests.post(self.graph_url, headers=headers, json=json_data)
            if response.status_code == 200:
                result = response.json()
                discussion_comments = result["data"]["repository"]["discussion"][
                    "comments"
                ]
                for edge in discussion_comments["edges"]:
                    comments.append(edge["node"])

                # 分页信息
                cursor = discussion_comments["pageInfo"]["endCursor"]
                has_next_page = discussion_comments["pageInfo"]["hasNextPage"]
            else:
                raise Exception(
                    f"Query failed to run by returning code of {response.status_code}. {response.text}"
                )

        return comments

    async def execute(self):
        try:
            print(f"actions={self.event['action']},sender={self.event['sender']}")
            # 忽略机器人回复
            if self.event["sender"]["type"] == "Bot":
                return {"success": True}
            if self.event["action"] in ["created", "edited"]:
                if self.not_mentioned_me():
                    return {"success": True}
                discussion = self.event["discussion"]
                discussion_number = discussion["number"]
                owner = self.event["organization"]["login"]
                repo_name = self.event["repository"]["full_name"]
                discussion_content = f"{discussion['title']}: {discussion['body']}"
                comments = self.get_comments(
                    owner, self.event["repository"]["name"], discussion_number
                )
                print("comments", comments)
                messages = [
                    Message(
                        role="assistant" if comment.user.type == "Bot" else "user",
                        content=[TextContentBlock(type="text", text=comment.body)],
                    )
                    for comment in comments
                ]
                print("messages", messages)
                repository_config = RepositoryConfigDAO()
                repo_config = repository_config.get_by_repo_name(repo_name)

                bot = get_bot_by_id(repo_config.robot_id)

                prompt = generate_issue_comment_prompt(
                    repo_name=repo_name,
                    issue_url=discussion.html_url,
                    issue_content=discussion_content,
                )
                print("promptprompt", prompt)

                analysis_result = await agent_chat(
                    ChatData(
                        prompt=prompt,
                        messages=messages,
                        bot_id=repo_config.robot_id,
                    ),
                    self.auth,
                    bot,
                )
                discussion_id = await self.get_discussion_id(
                    owner, self.event["repository"]["name"], discussion_number
                )
                await self.create_discussion_comment(
                    discussion_id, analysis_result["output"]
                )

        except GithubException as e:
            print(f"处理 GitHub 请求时出错：{e}")
            return {"success": False, "error": str(e)}
