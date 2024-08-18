import json

def need_github_login():
  return json.dumps({
    "error_info": "你必须先使用 GitHub 登录 petercat 才能使用此功能。 [登录地址](https://api.petercat.chat/api/auth/login)"
  })