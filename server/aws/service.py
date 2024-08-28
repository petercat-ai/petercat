from .schemas import ImageMetaData
from .constants import S3_BUCKET_NAME, STATIC_URL
from .exceptions import UploadError


def upload_image_to_s3(file, metadata: ImageMetaData, s3_client):
    try:
        file_content = file.file.read()

        s3_key = f"{file.filename}"

        custom_metadata = {
            "title": metadata.title if metadata.title else "",
            "description": metadata.description if metadata.description else "",
        }

        s3_client.put_object(
            Bucket=S3_BUCKET_NAME,
            Key=s3_key,
            Body=file_content,
            ContentType=file.content_type,
            Metadata=custom_metadata,
        )
        # you need to redirect your static domain to your s3 bucket domain
        s3_url = f"{STATIC_URL}/{s3_key}"
        return {"message": "File uploaded successfully", "url": s3_url}
    except Exception as e:
        raise UploadError(detail=str(e))
