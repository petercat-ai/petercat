from fastapi.testclient import TestClient
from main import app
from aws.dependencies import get_s3_client
import tempfile

client = TestClient(app)
s3_client = get_s3_client()


def test_upload_image_success(monkeypatch):
    def mock_put_object(Bucket, Key, Body, ContentType, Metadata):
        return {}

    monkeypatch.setattr(s3_client, "put_object", mock_put_object)

    # create temporary file for testing
    with tempfile.NamedTemporaryFile(suffix=".jpg") as temp_file:
        temp_file.write(b"Test image content")
        temp_file.seek(0)

        response = client.post(
            "/api/aws/upload",
            files={"file": ("test_image.jpg", tempfile, "image/jpeg")},
            data={"title": "Test Title", "description": "Test Description"},
        )

    print(f"aaaaaae{response.json()}")
    # assert response.status_code == 200
    # assert response.json()["status"] == "success"
    # assert "url" in response.json()["data"]


def test_upload_image_error(monkeypatch):
    def mock_put_object():
        raise Exception("Upload failed")

    monkeypatch.setattr(s3_client, "put_object", mock_put_object)

    # create temporary file for testing
    with tempfile.NamedTemporaryFile(suffix=".jpg") as temp_file:
        temp_file.write(b"Test image content")
        temp_file.seek(0)

        response = client.post(
            "/api/aws/upload",
            files={"file": ("test_image.jpg", temp_file, "image/jpeg")},
            data={"title": "Test Title", "description": "Test Description"},
        )

    assert response.status_code == 500
