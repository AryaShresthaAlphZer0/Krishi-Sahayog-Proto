import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config, DEFAULT_DB_PATH
from database.db import db
from database.migrate_legacy import migrate_legacy_users_table
from extensions import limiter

# Import models so SQLAlchemy knows about them before create_all()
from database import models  # noqa: F401

from routes.auth import auth_bp
from routes.crop_location import crop_location_bp
from routes.weather import weather_bp


app = Flask(__name__)
app.config.from_object(Config)


# =========================================================
# DATABASE
# =========================================================

# Rename any legacy `password` column to `password_hash` before
# the ORM touches the table, so existing accounts aren't lost.
migrate_legacy_users_table(DEFAULT_DB_PATH)

db.init_app(app)

with app.app_context():
    db.create_all()


# =========================================================
# JWT
# =========================================================

jwt = JWTManager(app)


@jwt.expired_token_loader
def handle_expired_token(jwt_header, jwt_payload):
    return jsonify({
        "success": False,
        "message": "Your session has expired. Please log in again."
    }), 401


@jwt.invalid_token_loader
def handle_invalid_token(reason):
    return jsonify({
        "success": False,
        "message": "Invalid authentication token."
    }), 401


@jwt.unauthorized_loader
def handle_missing_token(reason):
    return jsonify({
        "success": False,
        "message": "Authentication required."
    }), 401


# =========================================================
# RATE LIMITING
# Protects auth endpoints from brute-force/credential-stuffing
# and keeps the weather proxy from being abused.
# =========================================================

limiter.init_app(app)


# =========================================================
# CORS
# =========================================================

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": app.config["CORS_ORIGINS"]
        }
    },
    supports_credentials=True
)


# =========================================================
# SECURITY HEADERS
# Lightweight hardening — no extra dependency needed.
# =========================================================

@app.after_request
def set_security_headers(response):

    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

    return response


# =========================================================
# JSON ERROR HANDLERS
# Make sure clients always get JSON back, and that unexpected
# errors never leak stack traces or internal details.
# =========================================================

@app.errorhandler(404)
def handle_not_found(error):
    return jsonify({
        "success": False,
        "message": "Not found."
    }), 404


@app.errorhandler(405)
def handle_method_not_allowed(error):
    return jsonify({
        "success": False,
        "message": "Method not allowed."
    }), 405


@app.errorhandler(429)
def handle_rate_limit(error):
    return jsonify({
        "success": False,
        "message": "Too many requests. Please slow down and try again."
    }), 429


@app.errorhandler(500)
def handle_server_error(error):
    return jsonify({
        "success": False,
        "message": "Something went wrong on our end."
    }), 500


@app.errorhandler(Exception)
def handle_unexpected_error(error):

    # Don't swallow HTTP exceptions that already have proper
    # status codes (404, 405, etc.) — only generic exceptions.
    from werkzeug.exceptions import HTTPException

    if isinstance(error, HTTPException):
        return error

    print("UNHANDLED ERROR:", error)

    return jsonify({
        "success": False,
        "message": "Something went wrong on our end."
    }), 500


# =========================================================
# ROUTES
# =========================================================

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(crop_location_bp, url_prefix="/api/crop-location")
app.register_blueprint(weather_bp, url_prefix="/api/weather")


@app.route("/")
def home():
    return {
        "success": True,
        "message": "Krishi Sahayog API is running"
    }


if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=int(os.environ.get("PORT", 5000)),
        debug=app.config["DEBUG"]
    )