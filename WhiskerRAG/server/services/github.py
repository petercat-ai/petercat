import requests

GITHUB_API_URL = "https://api.github.com"

def get_repo_files_tree(github_name: str, repo_name: str, branch: str = None):
    headers = {
        "Accept": "application/vnd.github.v3+json",
    }
    
    # 获取仓库信息
    repo_url = f"{GITHUB_API_URL}/repos/{github_name}/{repo_name}"
    repo_response = requests.get(repo_url, headers=headers)
    repo_response.raise_for_status()
    repo_data = repo_response.json()
    
    # 如果没有指定分支，则使用默认分支
    if not branch:
        branch = repo_data['default_branch']
    
    # 获取树信息
    tree_url = f"{GITHUB_API_URL}/repos/{github_name}/{repo_name}/git/trees/{branch}?recursive=1"
    tree_response = requests.get(tree_url, headers=headers)
    tree_response.raise_for_status()
    tree_data = tree_response.json()
    
    return tree_data['tree']
  

#