
from langchain.tools import tool

@tool
def need_github_login():
  return "用户必须先使用 GitHub 登录才能使用此功能"