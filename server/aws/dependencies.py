from .constants import AWS_REGION
import boto3


def get_s3_client():
    session = boto3.session.Session()
    client = session.client(service_name="s3", region_name=AWS_REGION)
    return client
