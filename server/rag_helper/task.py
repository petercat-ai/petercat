from enum import Enum, auto
from typing import Optional, Dict

from github import Auth, Repository
from github import Github
from langchain_core.utils import get_from_env

from data_class import GitDocConfig
from db.supabase.client import get_client
from rag_helper import retrieval

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
        "sha": sha
    }

    return supabase.table(TABLE_NAME).insert(data).execute()


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
        supabase.table(TABLE_NAME).insert(task_list).execute()
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

    result = retrieval.add_knowledge_by_doc(GitDocConfig(repo_name=task["repo_name"],
                                                         file_path=task["path"],
                                                         commit_id=task["commit_id"]
                                                         ))

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
