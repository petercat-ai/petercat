import boto3
from botocore.exceptions import ClientError
from utils.env import get_env_variable
from utils.private_key.base import BasePrivateKeyProvider

REGION_NAME = get_env_variable("AWS_REGION")


class S3PrivateKeyProvider(BasePrivateKeyProvider):
    def get_private_key(self, secret_id: str) -> str:
        session = boto3.session.Session()
        client = session.client(service_name="secretsmanager", region_name=REGION_NAME)
        try:
            get_secret_value_response = client.get_secret_value(SecretId=secret_id)
        except ClientError as e:
            # For a list of exceptions thrown, see
            # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
            raise e

        return get_secret_value_response["SecretString"]