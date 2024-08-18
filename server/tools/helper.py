
from langchain.tools import tool

@tool
def need_github_login():
  return "你必须先使用 GitHub 登录才能使用此功能。[去登录](https://api.petercat.chat/api/auth/login)"