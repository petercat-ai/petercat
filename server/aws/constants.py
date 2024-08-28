from petercat_utils.utils.env import get_env_variable

SUCCESS_CODE = "UPLOAD_SUCCESS"
ERROR_CODES = {"credentials_error": "CREDENTIALS_ERROR", "upload_error": "UPLOAD_ERROR"}
S3_BUCKET_NAME = get_env_variable("S3_BUCKET_NAME")
STATIC_URL = get_env_variable("STATIC_URL")
AWS_REGION_NAME = get_env_variable("AWS_REGION_NAME")
