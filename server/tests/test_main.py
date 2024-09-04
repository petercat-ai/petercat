from fastapi.testclient import TestClient
from petercat_utils import get_env_variable
from main import app

API_URL = get_env_variable("API_URL")
WEB_URL = get_env_variable("WEB_URL")

client = TestClient(app)

def test_health_checker():
    response = client.get("/api/health_checker")
    assert response.status_code == 200
    assert response.json() == {
        'API_URL': API_URL,
        'CALLBACK_URL': f'{API_URL}/api/auth/callback',
        'WEB_URL': WEB_URL,
    }
