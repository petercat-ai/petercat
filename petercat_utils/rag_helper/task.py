import json
from enum import Enum, auto
from typing import Optional, Dict
import boto3

# Create SQS client
sqs = boto3.client('sqs')

from github import Github
from github import Repository

from ..utils.env import get_env_variable
from ..data_class import RAGGitDocConfig
from ..db.client.supabase import get_client
from ..rag_helper import retrieval

g = Github()

TABLE_NAME = "rag_tasks"

SQS_QUEUE_URL = get_env_variable("SQS_QUEUE_URL")

class TaskStatus(Enum):
    NOT_STARTED = auto()
    IN_PROGRESS = auto()
    COMPLETED = auto()
    ON_HOLD = auto()
    CANCELLED = auto()
    ERROR = auto()

def send_task_message(task_id: str):
    response = sqs.send_message(QueueUrl=SQS_QUEUE_URL, DelaySeconds=10, MessageBody=(json.dumps({ "task_id": task_id })))
    return response['MessageId']

def add_task(
    config: RAGGitDocConfig,
    extra: Optional[Dict[str, Optional[str]]] = {
        "node_type": None,
        "from_task_id": None,
    },
):
    repo = g.get_repo(config.repo_name)
    commit_id = config.commit_id if config.commit_id else repo.get_branch(config.branch).commit.sha

    if config.file_path == '' or config.file_path is None:
        extra["node_type"] = 'tree'

    if not extra.get("node_type"):
        content = repo.get_contents(config.file_path, ref=commit_id)
        if isinstance(content, list):
            extra["node_type"] = 'tree'
        else:
            extra["node_type"] = 'blob'

    sha = get_path_sha(repo, commit_id, config.file_path)

    supabase = get_client()

    data = {
        "repo_name": config.repo_name,
        "commit_id": commit_id,
        "status": TaskStatus.NOT_STARTED.name,
        "node_type": extra["node_type"],
        "from_task_id": extra["from_task_id"],
        "path": config.file_path,
        "sha": sha,
        "bot_id": config.bot_id
    }

    res = supabase.table(TABLE_NAME)\
        .insert(data)\
        .execute()

    record = res.data[0]
    task_id = record["id"]

    message_id = send_task_message(task_id=task_id)
    print(f"record={record}, task_id={task_id}, message_id={message_id}")
    return res


def get_path_sha(repo: Repository.Repository, sha: str, path: Optional[str] = None):
    if not path:
        return sha
    else:
        tree_data = repo.get_git_tree(sha)
        for item in tree_data.tree:
            if path.split("/")[0] == item.path:
                return get_path_sha(repo, item.sha, "/".join(path.split("/")[1:]))


def get_oldest_task():
    supabase = get_client()

    response = (supabase
                .table(TABLE_NAME)
                .select("*")
                .eq("status", TaskStatus.NOT_STARTED.name)
                .order("created_at", desc=False)
                .limit(1)
                .execute())

    return response.data[0] if (len(response.data) > 0) else None


def get_task_by_id(task_id):
    supabase = get_client()

    response = (supabase
                .table(TABLE_NAME)
                .select("*")
                .eq("id", task_id)
                .execute())
    return response.data[0] if (len(response.data) > 0) else None


def handle_tree_task(task):
    supabase = get_client()
    (supabase
     .table(TABLE_NAME)
     .update({"status": TaskStatus.IN_PROGRESS.name})
     .eq('id', task["id"])
     .execute()
     )

    repo = g.get_repo(task["repo_name"])
    tree_data = repo.get_git_tree(task["sha"])

    task_list = list(filter(lambda item: item["path"].endswith('.md') or item["node_type"] == 'tree', map(lambda item: {
        "repo_name": task["repo_name"],
        "commit_id": task["commit_id"],
        "status": TaskStatus.NOT_STARTED.name,
        "node_type": item.type,
        "from_task_id": task["id"],
        "path": "/".join(filter(lambda s: s, [task["path"], item.path])),
        "sha": item.sha
    }, tree_data.tree)))

    if len(task_list) > 0:
        result = supabase.table(TABLE_NAME).insert(task_list).execute()

        for record in result.data:
            task_id = record["id"]
            message_id = send_task_message(task_id=task_id)
            print(f"record={record}, task_id={task_id}, message_id={message_id}")

    return (supabase.table(TABLE_NAME).update(
        {"metadata": {"tree": list(map(lambda item: item.raw_data, tree_data.tree))},
         "status": TaskStatus.COMPLETED.name})
            .eq("id", task["id"])
            .execute())


def handle_blob_task(task):
    supabase = get_client()
    (supabase
     .table(TABLE_NAME)
     .update({"status": TaskStatus.IN_PROGRESS.name})
     .eq('id', task["id"])
     .execute()
     )

    retrieval.add_knowledge_by_doc(
        RAGGitDocConfig(
            repo_name=task["repo_name"],
            file_path=task["path"],
            commit_id=task["commit_id"],
            bot_id=task["bot_id"],
        )
    )
    return (supabase.table(TABLE_NAME).update(
        {"status": TaskStatus.COMPLETED.name})
            .eq("id", task["id"])
            .execute())

def trigger_task(task_id: Optional[str]):
    task = get_task_by_id(task_id) if task_id else get_oldest_task()
    if task is None:
        return task
    if task['node_type'] == 'tree':
        return handle_tree_task(task)
    else:
        return handle_blob_task(task)
