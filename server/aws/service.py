import base64
import hashlib
from botocore.signers import CloudFrontSigner
from petercat_utils import get_env_variable
import rsa
from datetime import datetime, timedelta

from utils.private_key import get_private_key
from .schemas import ImageMetaData
from .constants import S3_TEMP_BUCKET_NAME, STATIC_URL
from .exceptions import UploadError

REGION_NAME = get_env_variable("AWS_REGION")
STATIC_SECRET_NAME = get_env_variable("STATIC_SECRET_NAME")
STATIC_KEYPAIR_ID = get_env_variable("STATIC_KEYPAIR_ID")

def rsa_signer(message):
    private_key_str = get_private_key(STATIC_SECRET_NAME)
    private_key = rsa.PrivateKey.load_pkcs1(private_key_str.encode('utf-8'))
    return rsa.sign(message, private_key, 'SHA-1')

def create_signed_url(url, expire_minutes=60) -> str:
    cloudfront_signer = CloudFrontSigner(STATIC_KEYPAIR_ID, rsa_signer)
    
    # 设置过期时间
    expire_date = datetime.now() + timedelta(minutes=expire_minutes)
    
    # 创建签名 URL
    signed_url = cloudfront_signer.generate_presigned_url(
        url=url,
        date_less_than=expire_date
    )
    
    return signed_url

def upload_image_to_s3(file, metadata: ImageMetaData, s3_client):
    try:
        file_content = file.file.read()
        md5_hash = hashlib.md5()
        md5_hash.update(file.filename.encode('utf-8'))
        s3_key = md5_hash.hexdigest()
        encoded_filename = (
            base64.b64encode(metadata.title.encode("utf-8")).decode("utf-8")
            if metadata.title
            else ""
        )
        encoded_desc = (
            base64.b64encode(metadata.description.encode("utf-8")).decode("utf-8")
            if metadata.description
            else ""
        )

        custom_metadata = {
            "title": encoded_filename,
            "description": encoded_desc,
        }

        s3_client.put_object(
            Bucket=S3_TEMP_BUCKET_NAME,
            Key=s3_key,
            Body=file_content,
            ContentType=file.content_type,
            Metadata=custom_metadata,
        )
        # you need to redirect your static domain to your s3 bucket domain
        s3_url = f"{STATIC_URL}/{s3_key}"
        signed_url = create_signed_url(url=s3_url, expire_minutes=60) \
            if (STATIC_SECRET_NAME and STATIC_KEYPAIR_ID) \
                else s3_url
        return {"message": "File uploaded successfully", "url": signed_url }
    except Exception as e:
        raise UploadError(detail=str(e))
