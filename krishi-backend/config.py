import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # Flask secret
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "dev-secret-change-this"
    )

    # JWT secret
    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "dev-jwt-secret-change-this"
    )

    # SQLite database
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///krishi.db"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False