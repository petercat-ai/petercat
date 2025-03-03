from utils.env import get_env_variable
from utils.private_key.local import LocalPrivateKeyProvider
from utils.private_key.s3 import S3PrivateKeyProvider

PETERCAT_SECRETS_PROVIDER = get_env_variable("PETERCAT_SECRETS_PROVIDER", "aws")

def get_private_key(secret_id: str):
  provider = S3PrivateKeyProvider() if PETERCAT_SECRETS_PROVIDER == 'aws' else LocalPrivateKeyProvider()
  return provider.get_private_key(secret_id)
