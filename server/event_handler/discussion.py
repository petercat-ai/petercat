import requests
from typing import Any
from github import Github, Auth
from github import GithubException
from agent.qa_chat import agent_chat

from petercat_utils.data_class import ChatData, Message, TextContentBlock


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
        repo = self.event["repository"]["name"]
        discussion = self.event["discussion"]
        discussion_content = f"{discussion['title']}: {discussion['body']}"
        text_block = TextContentBlock(type="text", text=discussion_content)
        discussion_number = discussion["number"]
        message = Message(role="user", content=[text_block])

        analysis_result = await agent_chat(ChatData(messages=[message]), None)
        discussion_id = await self.get_discussion_id(owner, repo, discussion_number)
        await self.create_discussion_comment(discussion_id, analysis_result["output"])

    async def execute(self):
        try:
            action = self.event["action"]
            if action in ["opened", "reopened"]:
                await self.handle_discussion_event(action)
                return {"success": True}
            else:
                print(f"不支持的 action: {action}")
                return {"success": False, "message": f"Unsupported action: {action}"}

        except GithubException as e:
            print(f"处理 GitHub 请求时出错： {e}")
            return {"success": False, "error": str(e)}
