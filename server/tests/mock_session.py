import json
from base64 import b64encode
from itsdangerous import TimestampSigner
from core.models.user import User
from petercat_utils import get_env_variable

session_secret_key = get_env_variable("FASTAPI_SECRET_KEY")

def create_session_cookie(data) -> str:
    signer = TimestampSigner(str(session_secret_key))

    return signer.sign(
        b64encode(json.dumps(data).encode('utf-8')),
    ).decode('utf-8')

mock_user = User(id="1", sub="1", sid="1", avatar="1", picture="1", nickname="1", access_token="1", anonymous=False, agreement_accepted=False)

def get_mock_user():
    return mock_user

def mock_session():
  return {'session': create_session_cookie({"user": dict(mock_user) }) }
