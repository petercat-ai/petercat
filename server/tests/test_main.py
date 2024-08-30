from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_checker():
    response = client.get("/api/health_checker")
    assert response.status_code == 200
    assert response.json() == {
        'API_URL': 'http://127.0.0.1:8000',
        'CALLBACK_URL': 'http://127.0.0.1:8000/api/auth/callback',
        'WEB_URL': 'http://127.0.0.1:3000',
    }
