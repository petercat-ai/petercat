from dotenv import load_dotenv
import os

def load_env():
    env = os.getenv("ENV", "development")
    print(f"load_env={env}")
    load_dotenv(verbose=True, override=True)
    
    if env == 'development':
        load_dotenv(dotenv_path=".env.local", verbose=True, override=True)

load_env()

# Define a method to load an environmental variable and return its value
def get_env_variable(key: str, default=None):
    # Get the environment variable, returning the default value if it does not exist
    return os.getenv(key, default)
