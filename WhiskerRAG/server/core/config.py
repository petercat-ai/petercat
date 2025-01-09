from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

# 在加载 Pydantic 设置之前加载 .env 文件
load_dotenv()


class Settings(BaseSettings):
    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY")
    DB_PLUGIN_PATH: str = os.getenv("DB_PLUGIN_PATH")
    DEBUG: bool = os.getenv("DEBUG", "false").lower() in ["true", "1", "t"]
    WEB_URL: str = os.getenv("WEB_URL")
    CUSTOM_DB_CLASSNAME: str = os.getenv("CUSTOM_DB_CLASSNAME")

settings = Settings()
