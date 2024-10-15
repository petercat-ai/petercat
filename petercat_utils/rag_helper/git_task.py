import json
from abc import ABC, abstractmethod

import boto3

from ..data_class import TaskStatus, TaskType
from ..db.client.supabase import get_client
from ..utils.env import get_env_variable

sqs = boto3.client("sqs")

TABLE_NAME_MAP = {TaskType.GIT_DOC: "rag_tasks", TaskType.GIT_ISSUE: "git_issue_tasks"}
SQS_QUEUE_URL = get_env_variable("SQS_QUEUE_URL")


# Base GitTask Class
class GitTask(ABC):
    type: TaskType

    def __init__(
        self,
        type,
        repo_name,
        bot_id,
        status=TaskStatus.NOT_STARTED,
        from_id=None,
        id=None,
    ):
        self.type = type
        self.id = id
        self.from_id = from_id
        self.status = status
        self.repo_name = repo_name
        self.bot_id = bot_id

    @staticmethod
    def get_table_name(type: TaskType):
        return TABLE_NAME_MAP[type]

    @property
    def table_name(self):
        return GitTask.get_table_name(self.type)

    @property
    def raw_data(self):
        data = {
            **self.extra_save_data(),
            "repo_name": self.repo_name,
            "from_task_id": self.from_id,
            "status": self.status.value,
        }
        return data

    def get_table(self):
        supabase = get_client()
        return supabase.table(self.table_name)

    def update_status(self, status: TaskStatus):
        return (
            self.get_table()
            .update({"status": status.value})
            .eq("id", self.id)
            .execute()
        )

    def save(self):
        res = self.get_table().insert(self.raw_data).execute()
        self.id = res.data[0]["id"]
        return res

    @abstractmethod
    def extra_save_data(self):
        pass

    @abstractmethod
    def handle(self):
        pass

    def send(self):
        assert self.id, "Task ID needed, save it first"
        assert self.type, "Task type needed, set it first"

        response = sqs.send_message(
            QueueUrl=SQS_QUEUE_URL,
            DelaySeconds=10,
            MessageBody=(
                json.dumps({"task_id": self.id, "task_type": self.type.value})
            ),
        )
        message_id = response["MessageId"]
        print(
            f"task_id={self.id}, task_type={self.type.value}, message_id={message_id}"
        )
        return message_id
