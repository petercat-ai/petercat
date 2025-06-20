from unittest import TestCase

from petercat_utils import task

from github import Github

from petercat_utils.data_class import RAGGitDocConfig , TaskType
from petercat_utils.db.client.supabase import get_client
from petercat_utils.rag_helper import git_doc_task

from petercat_utils import retrieval

g = Github()

repo_name = "opendilab/CleanS2S"

def convert_to_dict(task):
    return {
        "commit_id": task.commit_id,
        "node_type": task.node_type.value,
        "sha": task.sha,
        "path": task.path,
        "repo_name": task.repo_name,
        "status": task.status,
        "type": task.type,
        "from_id": task.from_id,
        "id": task.id,
    }

def mock_rag_task(repo_name: str, bot_id: str):
    try:
        repo = g.get_repo(repo_name)
        default_branch = repo.default_branch
        config = RAGGitDocConfig(
            repo_name=repo_name,
            branch=default_branch,
            bot_id=bot_id,
            file_path="",
            commit_id="",
        )
        return git_doc_task.add_rag_git_doc_task(config)
    except Exception as e:
        print(f"trigger_rag_task error: {e}")


def mock_bot():
    repo = g.get_repo(repo_name)

    bot_data = {
        "name": repo_name,
        "description": "",
        "avatar": repo.organization.avatar_url if repo.organization else None,
        "prompt": "",
        "uid": "-1",
        "label": "Assistant",
        "starters": (
        ),
        "public": False,
        "hello_message": (            ),
        "repo_name": repo_name,
        "llm": "openai",
        "token_id": ""
    }
    res = get_client().table("bots").insert(bot_data).execute()

    print(res)
    return res.data[0]

class TestTask(TestCase):
    repo_name = repo_name

    def setUp(self):
        # mock a bot record
        res = mock_bot()
        print(res)
        self.bot_id = res["id"]
        # mock the rag task of this bot
        res = mock_rag_task(self.repo_name, self.bot_id)
        res = res.data[0]
        self.task_id = res["id"]
        print(res)

    def test_send_message(self):
        from uuid import uuid4
        res = task.send_task_message(uuid4().__str__())
        print(res)

    def test_get_old_rag_task(self):
        res = task.get_oldest_task()
        print(res)


    def test_get_task_by_id(self):
        res = task.get_task_by_id(self.task_id)
        print(res)


    def test_get_task_doc(self):
        type = TaskType.GIT_DOC
        res = task.get_task(type, self.task_id)
        res = convert_to_dict(res)
        print(res)


    def test_trigger_task_type_doc(self):
        type = TaskType.GIT_DOC
        res = task.trigger_task(type, self.task_id)
        print(res)


    def test_single_message_handle_lambda_function_handle(self):
        type = TaskType.GIT_DOC
        res = task.trigger_task(type, self.task_id)
        print(res)

        res = (get_client()
               .table("rag_tasks")
               .select("*")
               .eq("repo_name", self.repo_name)
               .execute())
        print(res)
        blob_node = [node for node in res.data if node['node_type'] == 'BLOB']
        res = blob_node[0]
        print(res)

        # save blob file to chunkList
        res.handle()
        if res["node_type"] == "blob":
            chunkList = retrieval.get_chunk_list(self.repo_name, 1, 10)
            if chunkList:
                self.assertTrue(chunkList["total"] > 0)
