from fastapi.testclient import TestClient
from auth.get_user_info import get_user
from main import app
from aws.dependencies import get_s3_client
import tempfile

from tests.utils.mock_session import get_mock_user, mock_session

client = TestClient(app)
s3_client = get_s3_client()


app.dependency_overrides[get_user] = get_mock_user

def test_upload_image_success(monkeypatch):
    def mock_put_object(Bucket, Key, Body, ContentType, Metadata):
        return {}

    monkeypatch.setattr(s3_client, "put_object", mock_put_object)

    # create temporary file for testing
    with tempfile.NamedTemporaryFile(suffix=".jpg") as temp_file:
        temp_file.write(b"Test image content")
        temp_file.seek(0)
        with open(temp_file.name, "rb") as file_to_upload:
            response = client.post(
                "/api/aws/upload",
                files={"file": ("test_image.jpg", file_to_upload, "image/jpeg")},
                data={"title": "Test Title", "description": "Test Description"},
                cookies=mock_session()
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
            cookies=mock_session()
        )

    assert response.status_code == 500
