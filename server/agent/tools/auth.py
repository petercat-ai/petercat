from langchain.tools import tool

from agent.tools.helper import need_github_login

def factory(token: str):
    @tool
    def check_login():
        """
        Get user login status

        :return: True if login, or a "LOGIN_INVITE" card
        """
        if token is None:
            return need_github_login()
        return True

    return {
        "check_login": check_login
    }