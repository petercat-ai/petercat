from enum import Enum, auto
from typing import Optional, Dict

from github import Auth
from github import Github
from langchain_core.utils import get_from_env

from data_class import GitDocConfig
from db.supabase.client import get_client

g = Github(auth=Auth.Token(get_from_env("access_token", 'GITHUB_TOKEN')))

TABLE_NAME = "rag_tasks"


class TaskStatus(Enum):
    NOT_STARTED = auto()
    IN_PROGRESS = auto()
    COMPLETED = auto()
    ON_HOLD = auto()
    CANCELLED = auto()
    ERROR = auto()


def add_task(config: GitDocConfig,
             extra: Optional[Dict[str, Optional[str]]] = {"node_type": None, "from_task_id": None}):
    repo = g.get_repo(config.repo_name)
    commit_id = config.commit_id if config.commit_id else repo.get_branch(config.branch).commit.sha

    if config.file_path == '' or config.file_path is None:
        extra["node_type"] = 'dir'

    if not extra.get("node_type"):
        content = repo.get_contents(config.file_path, ref=commit_id)
        if isinstance(content, list):
            extra["node_type"] = 'dir'
        else:
            extra["node_type"] = 'file'

    supabase = get_client()

    data = {
        "repo_name": config.repo_name,
        "commit_id": commit_id,
        "status": TaskStatus.NOT_STARTED.name,
        "node_type": extra["node_type"],
        "from_task_id": extra["from_task_id"],
        "path": config.file_path
    }

    return supabase.table(TABLE_NAME).insert(data).execute()


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


def handle_dir_task():
    return None


def handle_file_task():
    return None


def trigger_task():
    task = get_oldest_task()
    if task is None:
        return task
    if task['node_type'] == 'dir':
        return 'wow'
    else:
        return 'gogogo'
