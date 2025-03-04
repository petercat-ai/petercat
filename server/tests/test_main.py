from fastapi.testclient import TestClient

from server.env import ENVIRONMENT, WEB_URL, API_URL
from server.main import app

client = TestClient(app)


def test_health_checker():
    response = client.get("/api/health_checker")
    assert response.status_code == 200
    assert response.json() == {
        "ENVIRONMENT": ENVIRONMENT,
        "API_URL": API_URL,
        "CALLBACK_URL": f"{API_URL}/api/auth/callback",
        "WEB_URL": WEB_URL,
    }
