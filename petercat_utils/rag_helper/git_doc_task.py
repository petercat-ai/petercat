from typing import Optional

from github import Github, Repository

from .git_task import GitTask
from ..data_class import RAGGitDocConfig, TaskStatus, TaskType, GitDocTaskNodeType
from ..rag_helper import retrieval

g = Github()


def get_path_sha(repo: Repository.Repository, sha: str, path: Optional[str] = None):
    if not path:
        return sha
    else:
        tree_data = repo.get_git_tree(sha)
        for item in tree_data.tree:
            if path.split("/")[0] == item.path:
                return get_path_sha(repo, item.sha, "/".join(path.split("/")[1:]))


def add_rag_git_doc_task(config: RAGGitDocConfig, extra=None):
    if extra is None:
        extra = {
            "node_type": None,
            "from_task_id": None,
        }
    repo = g.get_repo(config.repo_name)

    commit_id = (
        config.commit_id
        if config.commit_id
        else repo.get_branch(config.branch).commit.sha
    )
    if config.file_path == "" or config.file_path is None:
        extra["node_type"] = GitDocTaskNodeType.TREE.value

    if not extra.get("node_type"):
        content = repo.get_contents(config.file_path, ref=commit_id)
        if isinstance(content, list):
            extra["node_type"] = GitDocTaskNodeType.TREE.value
        else:
            extra["node_type"] = GitDocTaskNodeType.BLOB.value

    sha = get_path_sha(repo, commit_id, config.file_path)

    doc_task = GitDocTask(
        commit_id=commit_id,
        sha=sha,
        repo_name=config.repo_name,
        node_type=extra["node_type"],
        bot_id=config.bot_id,
        path=config.file_path,
    )
    res = doc_task.save()
    doc_task.send()
    return res


class GitDocTask(GitTask):
    node_type: GitDocTaskNodeType

    def __init__(
        self,
        commit_id,
        node_type: GitDocTaskNodeType,
        sha,
        bot_id,
        path,
        repo_name,
        status=TaskStatus.NOT_STARTED,
        from_id=None,
        id=None,
    ):
        super().__init__(
            bot_id=bot_id,
            type=TaskType.GIT_DOC,
            from_id=from_id,
            id=id,
            status=status,
            repo_name=repo_name,
        )
        self.commit_id = commit_id
        self.node_type = GitDocTaskNodeType(node_type)
        self.sha = sha
        self.path = path

    def extra_save_data(self):
        data = {
            "commit_id": self.commit_id,
            "node_type": self.node_type.value,
            "path": self.path,
            "sha": self.sha,
        }
        return data

    def handle_tree_node(self):
        repo = g.get_repo(self.repo_name)
        tree_data = repo.get_git_tree(self.sha)

        task_list = list(
            filter(
                lambda item: item["path"].endswith(".md")
                or item["node_type"] == GitDocTaskNodeType.TREE.value,
                map(
                    lambda item: {
                        "repo_name": self.repo_name,
                        "commit_id": self.commit_id,
                        "status": TaskStatus.NOT_STARTED.value,
                        "node_type": (item.type + "").upper(),
                        "from_task_id": self.id,
                        "path": "/".join(filter(lambda s: s, [self.path, item.path])),
                        "sha": item.sha,
                    },
                    tree_data.tree,
                ),
            )
        )

        if len(task_list) > 0:
            result = self.get_table().insert(task_list).execute()

            for record in result.data:
                doc_task = GitDocTask(
                    id=record["id"],
                    commit_id=record["commit_id"],
                    sha=record["sha"],
                    repo_name=record["repo_name"],
                    node_type=record["node_type"],
                    path=record["path"],
                )
                doc_task.send()

        return (
            self.get_table()
            .update(
                {
                    "metadata": {
                        "tree": list(map(lambda item: item.raw_data, tree_data.tree)),
                        "bot_id": self.bot_id,
                    },
                    "status": TaskStatus.COMPLETED.value,
                }
            )
            .eq("id", self.id)
            .execute()
        )

    def handle_blob_node(self):
        retrieval.add_knowledge_by_doc(
            RAGGitDocConfig(
                repo_name=self.repo_name,
                file_path=self.path,
                commit_id=self.commit_id,
                bot_id=self.bot_id,
            )
        )
        return self.update_status(TaskStatus.COMPLETED)

    def handle(self):
        self.update_status(TaskStatus.IN_PROGRESS)
        if self.node_type == GitDocTaskNodeType.TREE:
            return self.handle_tree_node()
        elif self.node_type == GitDocTaskNodeType.BLOB:
            return self.handle_blob_node()
        else:
            raise ValueError(f"Unsupported node type [{self.node_type}]")
