from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_checker():
    response = client.get("/api/health_checker")
    assert response.status_code == 200
    assert response.json() == { "Hello": "World" }
