from github import Github

from .git_task import GitTask
from ..data_class import GitIssueTaskNodeType, TaskStatus, TaskType, RAGGitIssueConfig
from ..rag_helper import issue_retrieval

GITHUB_PER_PAGE = 30
g = Github(per_page=GITHUB_PER_PAGE)


def add_rag_git_issue_task(config: RAGGitIssueConfig):
    g.get_repo(config.repo_name)

    issue_task = GitIssueTask(
        issue_id='',
        node_type=GitIssueTaskNodeType.REPO,
        bot_id=config.bot_id,
        repo_name=config.repo_name
    )
    res = issue_task.save()
    issue_task.send()

    return res


def create_rag_git_issue_task(record):
    return GitIssueTask(id=record["id"],
                        issue_id=record["issue_id"],
                        repo_name=record["repo_name"],
                        node_type=record["node_type"],
                        bot_id=record["bot_id"],
                        status=record["status"],
                        from_id=record["from_task_id"],
                        page_index=record["page_index"]
                        )


class GitIssueTask(GitTask):
    issue_id: int
    page_index: int
    node_type: GitIssueTaskNodeType

    def __init__(self,
                 issue_id,
                 node_type: GitIssueTaskNodeType,
                 bot_id,
                 repo_name,
                 status=TaskStatus.NOT_STARTED,
                 from_id=None,
                 id=None,
                 page_index=None
                 ):
        super().__init__(bot_id=bot_id, type=TaskType.GIT_ISSUE, from_id=from_id, id=id, status=status,
                         repo_name=repo_name)
        self.issue_id = issue_id
        self.page_index = page_index
        self.node_type = GitIssueTaskNodeType(node_type)

    def extra_save_data(self):
        return {
            "issue_id": self.issue_id,
            "node_type": self.node_type.value,
        }

    def handle(self):
        self.update_status(TaskStatus.IN_PROGRESS)
        if self.node_type == GitIssueTaskNodeType.REPO:
            return self.handle_repo_node()
        elif self.node_type == GitIssueTaskNodeType.ISSUE:
            return self.handle_issue_node()
        else:
            raise ValueError(f"Unsupported node type [{self.node_type}]")

    def handle_repo_node(self):
        repo = g.get_repo(self.repo_name)
        issues = repo.get_issues(state='all')
        latest_page = (self.get_table()
                       .select('*')
                       .eq('repo_name', self.repo_name)
                       .eq('node_type', GitIssueTaskNodeType.ISSUE_PAGE.value)
                       .order('page_index', desc=True)
                       .limit(1)
                       .execute()).data

        slice_page_index = latest_page[0]["page_index"] if len(latest_page) > 0 else 0

        if len(latest_page) > 0:
            create_rag_git_issue_task(latest_page[0]).send()

        if issues.totalCount > 0:
            pages = issues.totalCount // GITHUB_PER_PAGE + (1 if issues.totalCount % GITHUB_PER_PAGE != 0 else 0)
            pages_array = list(range(1, pages + 1))[slice_page_index:]
            task_list = list(
                map(
                    lambda item: {
                        "repo_name": self.repo_name,
                        "status": TaskStatus.NOT_STARTED.value,
                        "node_type": GitIssueTaskNodeType.ISSUE_PAGE.value,
                        "from_task_id": self.id,
                        "bot_id": self.bot_id,
                        "page_index": item
                    },
                    pages_array,
                ),
            )
            if len(task_list) > 0:
                result = self.get_table().insert(task_list).execute()
                for record in result.data:
                    issue_task = create_rag_git_issue_task(record)
                    issue_task.send()

        return (self.get_table().update(
            {"status": TaskStatus.COMPLETED.value})
                .eq("id", self.id)
                .execute())

    def handle_issue_node(self):
        issue_retrieval.add_knowledge_by_issue(
            RAGGitIssueConfig(
                repo_name=self.repo_name,
                bot_id=self.bot_id,
                issue_id=self.issue_id
            )
        )
        return self.update_status(TaskStatus.COMPLETED)
