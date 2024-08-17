from typing import Optional, Dict

from github import Github, Repository
from petercat_utils.data_class import TaskType

from .task import GitTask
from ..data_class import RAGGitDocConfig, TaskStatus, TaskType
from ..db.client.supabase import get_client

g = Github()

TABLE_NAME = "rag_tasks"


class GitDocTask(GitTask):
    def __init__(self,
                 commit_id,
                 node_type,
                 sha,
                 bot_id,
                 path,
                 repo_name,
                 status=TaskStatus.NOT_STARTED,
                 from_id=None,
                 id=None
                 ):
        super().__init__(bot_id=bot_id, type=TaskType.GitDoc, from_id=from_id, id=id, status=status,
                         repo_name=repo_name)
        self.commit_id = commit_id
        self.node_type = node_type
        self.sha = sha
        self.path = path

    def extra_save_data(self):
        data = {
            "commit_id": self.commit_id,
            "node_type": self.node_type,
            "path": self.path,
            "sha": self.sha,
        }
        return data


def get_path_sha(repo: Repository.Repository, sha: str, path: Optional[str] = None):
    if not path:
        return sha
    else:
        tree_data = repo.get_git_tree(sha)
        for item in tree_data.tree:
            if path.split("/")[0] == item.path:
                return get_path_sha(repo, item.sha, "/".join(path.split("/")[1:]))


def add_rag_git_doc_task(config: RAGGitDocConfig,
                         extra: Optional[Dict[str, Optional[str]]] = {
                             "node_type": None,
                             "from_task_id": None,
                         }
                         ):
    repo = g.get_repo(config.repo_name)

    commit_id = (
        config.commit_id
        if config.commit_id
        else repo.get_branch(config.branch).commit.sha
    )
    if config.file_path == "" or config.file_path is None:
        extra["node_type"] = "tree"

    if not extra.get("node_type"):
        content = repo.get_contents(config.file_path, ref=commit_id)
        if isinstance(content, list):
            extra["node_type"] = "tree"
        else:
            extra["node_type"] = "blob"

    sha = get_path_sha(repo, commit_id, config.file_path)

    doc_task = GitDocTask(commit_id=commit_id,
                          sha=sha,
                          repo_name=config.repo_name,
                          node_type=extra["node_type"],
                          bot_id=config.bot_id,
                          path=config.file_path)
    res = doc_task.save()
    doc_task.send()
    return res

def handle_tree_task(task):
    supabase = get_client()
    (
        supabase.table(TABLE_NAME)
        .update({"status": TaskStatus.IN_PROGRESS.name})
        .eq("id", task["id"])
        .execute()
    )

    repo = g.get_repo(task["repo_name"])
    tree_data = repo.get_git_tree(task["sha"])

    task_list = list(
        filter(
            lambda item: item["path"].endswith(".md") or item["node_type"] == "tree",
            map(
                lambda item: {
                    "repo_name": task["repo_name"],
                    "commit_id": task["commit_id"],
                    "status": TaskStatus.NOT_STARTED.name,
                    "node_type": item.type,
                    "from_task_id": task["id"],
                    "path": "/".join(filter(lambda s: s, [task["path"], item.path])),
                    "sha": item.sha,
                    "bot_id": task["bot_id"],
                },
                tree_data.tree,
            ),
        )
    )

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
    (
        supabase.table(TABLE_NAME)
        .update({"status": TaskStatus.IN_PROGRESS.name})
        .eq("id", task["id"])
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
    return (
        supabase.table(TABLE_NAME)
        .update({"status": TaskStatus.COMPLETED.name})
        .eq("id", task["id"])
        .execute()
    )
