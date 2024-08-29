
import boto3
import io

S3_BUCKET = "petercat-env-variables"
ENV_FILE = ".env"

s3 = boto3.resource('s3')

obj = s3.Object(S3_BUCKET, ENV_FILE)
data = io.BytesIO()

obj.download_fileobj(data)

with open("./server/.env", 'wb') as f:
  f.write(data.getvalue())