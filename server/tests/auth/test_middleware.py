from fastapi.testclient import TestClient
from agent import qa_chat
from agent.bot.get_bot import get_bot
from auth.middleware import AuthMiddleWare
from core.service.user_llm_token import UserLLMTokenService
from main import app

client = TestClient(app)

async def mock_chat_qa(bot_id: str, prompt: str, messages: list):
  return {"response": "mocked response"}

def mock_llm_token_service(self, **args):  
    return None

def mock_get_bot():
    return None

async def mock_oath(self, request):
    return True

def test_default_cors_allow_origin():
    response = client.get(
        "/api/health_checker", headers={"Origin": "http://localhost:3000"}
    )

    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"

def test_without_authorization(monkeypatch):
    monkeypatch.setattr(UserLLMTokenService, "__init__", mock_llm_token_service)
    monkeypatch.setattr(qa_chat, "agent_chat", mock_chat_qa)
    app.dependency_overrides[get_bot] = mock_get_bot

    response = client.post(
        "/api/chat/qa",
        headers={
            "origin": "https://another.com",
            "sec-fetch-mode": "cors",
            "content-type": "application/json",
        },
        json={
            "bot_id": "db47cb13-b338-4c50-99dc-1a733c4e878d",
            "prompt": "",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",  # 必填字段
                            "text": "这么神奇么",  # 必填字段
                        }
                    ],
                }
            ],
        },
    )

    assert response.status_code == 401

def test_cors_with_authorization(monkeypatch):
    monkeypatch.setattr(UserLLMTokenService, "__init__", mock_llm_token_service)
    monkeypatch.setattr(qa_chat, "agent_chat", mock_chat_qa)
    monkeypatch.setattr(AuthMiddleWare, "oauth", mock_oath)
    app.dependency_overrides[get_bot] = mock_get_bot

    response = client.post(
        "/api/chat/qa",
        headers={
            "origin": "https://another.com",
            "authorization": "Bearer db47cb13-b338-4c50-99dc-1a733c4e878d",
            "sec-fetch-mode": "cors",
            "content-type": "application/json",
        },
        json={
            "bot_id": "db47cb13-b338-4c50-99dc-1a733c4e878d",
            "prompt": "",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",  # 必填字段
                            "text": "这么神奇么",  # 必填字段
                        }
                    ],
                }
            ],
        },
    )

    print(f"response.headers={response.headers}")
    assert response.headers.get("access-control-allow-origin") == "https://another.com"
