import json
from typing import Optional

import boto3

from petercat_utils.rag_helper.git_task import GitTask
from .git_doc_task import GitDocTask

# Create SQS client
sqs = boto3.client("sqs")

from github import Github

from ..utils.env import get_env_variable
from ..data_class import TaskStatus, TaskType, GitDocTaskNodeType
from ..db.client.supabase import get_client

g = Github()

TABLE_NAME = "rag_tasks"

SQS_QUEUE_URL = get_env_variable("SQS_QUEUE_URL")


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


def get_task( task_type: TaskType, task_id: str):
    supabase = get_client()
    response = (supabase.table(GitTask.get_table_name(task_type))
                .select("*")
                .eq("id", task_id)
                .execute())
    if len(response.data) > 0:
        data = response.data[0]
        if task_type is TaskType.GIT_DOC:
            return GitDocTask(
                id=data["id"],
                commit_id=data["commit_id"],
                sha=data["sha"],
                repo_name=data["repo_name"],
                node_type=data["node_type"],
                bot_id=data["bot_id"],
                path=data["path"],
                status=data["status"]
            )


def trigger_task(task_type: TaskType, task_id: Optional[str]):
    task = get_task(task_type, task_id) if task_id else get_oldest_task()
    if task is None:
        return task
    return task.handle()

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
