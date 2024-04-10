from dotenv import load_dotenv
import os

# Define a method to load an environmental variable and return its value
def get_env_variable(key: str, default=None):
    """
    Retrieve the specified environment variable. Return the specified default value if the variable does not exist.

    :param key: The name of the environment variable to retrieve.
    :param default: The default value to return if the environment variable does not exist.
    :return: The value of the environment variable, or the default value if it does not exist.
    """
    # Load the .env file
    load_dotenv(verbose=True, override=True)

    # Get the environment variable, returning the default value if it does not exist
    return os.getenv(key, default)
