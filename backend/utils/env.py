import os

from pydantic import BaseSettings


class Settings(BaseSettings):
    """Settings for the application.

    The settings are loaded from the .env file if provided and can be overridden
    by environment variables with the same name.
    """

    API_TOKEN: str
    DATABASE_ID: str
    NOTION_API_URL: str
    JWT_SECRET_KEY: str
    AUTH_TOKEN_DURATION: int = 120

    class Config:
        env_file = ".env"


# Create an instance of the Settings class to be used throughout the application.
env = Settings()

# Override the environment variables with any that are passed at runtime
# using the same variable names as defined in the Settings class.
env.API_TOKEN = os.getenv("API_TOKEN", env.API_TOKEN)
env.DATABASE_ID = os.getenv("DATABASE_ID", env.DATABASE_ID)
env.NOTION_API_URL = os.getenv("NOTION_API_URL", env.NOTION_API_URL)
env.JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", env.JWT_SECRET_KEY)
env.AUTH_TOKEN_DURATION = os.getenv("AUTH_TOKEN_DURATION", env.AUTH_TOKEN_DURATION)
