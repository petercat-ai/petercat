import base64
from .schemas import ImageMetaData
from .constants import S3_TEMP_BUCKET_NAME, STATIC_URL
from .exceptions import UploadError


def upload_image_to_s3(file, metadata: ImageMetaData, s3_client):
    try:
        file_content = file.file.read()

        s3_key = f"{file.filename}"
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
        return {"message": "File uploaded successfully", "url": s3_url}
    except Exception as e:
        raise UploadError(detail=str(e))
