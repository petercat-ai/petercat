import json

def need_github_login():
  return json.dumps({
    "type": "card",
    "template_id": "LOGIN_INVITE",
    "error_info": "你必须先登录 petercat 才能使用此功能。请点击下方登录按钮登录。"
  })
