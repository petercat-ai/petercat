import json
from enum import Enum
from typing import Optional, Dict

import boto3
from petercat_utils.data_class import RAGGitIssueConfig, TaskType

# Create SQS client
sqs = boto3.client("sqs")

from github import Github
from github import Repository
from abc import ABC, abstractmethod

from ..utils.env import get_env_variable
from ..data_class import RAGGitDocConfig, TaskStatus
from ..db.client.supabase import get_client
from ..rag_helper import retrieval

g = Github()

TABLE_NAME = "rag_tasks"
TABLE_NAME_MAP = {
    TaskType.GitDoc: 'rag_tasks'
}

SQS_QUEUE_URL = get_env_variable("SQS_QUEUE_URL")


# Base GitTask Class
class GitTask(ABC):
    def __init__(self, type, repo_name, bot_id, status=TaskStatus.NOT_STARTED, from_id=None, id=None):
        self.type = type
        self.id = id
        self.from_id = from_id
        self.status = status
        self.repo_name = repo_name
        self.bot_id = bot_id

    @property
    def table_name(self):
        return TABLE_NAME_MAP[self.type]

    def get_table(self):
        supabase = get_client()
        supabase.table(self.table_name)

    def update_status(self, status: TaskStatus):
        return (self.get_table()
                .update({"status": status.name})
                .eq("id", self.id)
                .execute())

    def save(self):
        data = {
            **self.extra_save_data(),
            "repo_name": self.repo_name,
            "bot_id": self.bot_id,
            "from_task_id": self.from_id,
            "status": self.status.name,
        }
        res = self.get_table().insert(data).execute()
        self.id = res.data[0]['id']
        return res

    @abstractmethod
    def extra_save_data(self):
        pass

    def send(self):
        assert self.id, "Task ID needed, save it first"
        assert self.type, "Task type needed, set it first"

        response = sqs.send_message(
            QueueUrl=SQS_QUEUE_URL,
            DelaySeconds=10,
            MessageBody=(json.dumps({"task_id": self.id, "task_type": self.type})),
        )
        message_id = response["MessageId"]
        print(f"task_id={task_id}, message_id={message_id}")
        return message_id


def send_task_message(task_id: str):
    response = sqs.send_message(
        QueueUrl=SQS_QUEUE_URL,
        DelaySeconds=10,
        MessageBody=(json.dumps({"task_id": task_id})),
    )
    return response["MessageId"]


def get_oldest_task():
    supabase = get_client()

    response = (
        supabase.table(TABLE_NAME)
        .select("*")
        .eq("status", TaskStatus.NOT_STARTED.name)
        .order("created_at", desc=False)
        .limit(1)
        .execute()
    )

    return response.data[0] if (len(response.data) > 0) else None


def get_task_by_id(task_id):
    supabase = get_client()

    response = supabase.table(TABLE_NAME).select("*").eq("id", task_id).execute()
    return response.data[0] if (len(response.data) > 0) else None


def trigger_task(task_id: Optional[str]):
    task = get_task_by_id(task_id) if task_id else get_oldest_task()
    if task is None:
        return task
    if task["node_type"] == "tree":
        return handle_tree_task(task)
    else:
        return handle_blob_task(task)


def get_latest_task_by_bot_id(bot_id: str):
    supabase = get_client()
    response = (
        supabase.table(TABLE_NAME)
        .select("*")
        .eq("bot_id", bot_id)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    return response.data[0] if (len(response.data) > 0) else None
