import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()


def _get_bool(name, default=False):

    value = os.getenv(name)

    if value is None:
        return default

    return value.strip().lower() in ("1", "true", "yes", "on")


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

INSTANCE_DIR = os.path.join(BASE_DIR, "instance")

DEFAULT_DB_PATH = os.path.join(INSTANCE_DIR, "krishi.db")


class Config:

    # =====================================================
    # FLASK
    # =====================================================

    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "dev-secret-change-this"
    )

    # Never run with the debugger enabled unless explicitly
    # opted into via .env — Flask's debug mode allows arbitrary
    # code execution through the interactive debugger and must
    # never be on in production.
    DEBUG = _get_bool("FLASK_DEBUG", default=False)

    # Reject request bodies over 1 MB by default — cheap
    # protection against oversized-payload abuse.
    MAX_CONTENT_LENGTH = int(
        os.getenv("MAX_CONTENT_LENGTH", 1 * 1024 * 1024)
    )


    # =====================================================
    # DATABASE
    # =====================================================

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{DEFAULT_DB_PATH}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False


    # =====================================================
    # JWT
    # =====================================================

    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "dev-jwt-secret-change-this"
    )

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        minutes=int(os.getenv("JWT_ACCESS_TOKEN_MINUTES", 60))
    )

    JWT_REFRESH_TOKEN_EXPIRES = timedelta(
        days=int(os.getenv("JWT_REFRESH_TOKEN_DAYS", 30))
    )

    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_TYPE = "Bearer"


    # =====================================================
    # CORS
    # Comma-separated list of allowed frontend origins.
    # =====================================================

    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173"
        ).split(",")
        if origin.strip()
    ]


    # =====================================================
    # RATE LIMITING
    # "memory://" is fine for a single-process dev server.
    # For multiple workers/processes in production, point this
    # at Redis (e.g. "redis://localhost:6379") so all workers
    # share the same limit counters.
    # =====================================================

    RATELIMIT_STORAGE_URI = os.getenv(
        "RATELIMIT_STORAGE_URI",
        "memory://"
    )