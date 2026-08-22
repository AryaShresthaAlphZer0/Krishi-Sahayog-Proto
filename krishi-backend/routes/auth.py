import re

from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)

from database.db import db
from database.models import User
from extensions import limiter
from utils.auth import hash_password, verify_password


auth_bp = Blueprint("auth", __name__)


EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

MAX_NAME_LENGTH = 100
MAX_EMAIL_LENGTH = 120


def _issue_tokens(user):
    """Build the token pair + public user payload returned on
    both signup and login."""

    identity = str(user.id)

    return {
        "access_token": create_access_token(identity=identity),
        "refresh_token": create_refresh_token(identity=identity),
        "user": user.to_public_dict(),
    }


# =========================================================
# SIGNUP
# =========================================================

@auth_bp.route("/signup", methods=["POST"])
@limiter.limit("10 per hour")
def signup():

    try:

        data = request.get_json(silent=True)

        if not data:
            return jsonify({
                "success": False,
                "message": "No data received."
            }), 400


        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")


        # ---- Validation ----

        if not name:
            return jsonify({
                "success": False,
                "message": "Name is required."
            }), 400

        if len(name) > MAX_NAME_LENGTH:
            return jsonify({
                "success": False,
                "message": "Name is too long."
            }), 400

        if not email:
            return jsonify({
                "success": False,
                "message": "Email is required."
            }), 400

        if len(email) > MAX_EMAIL_LENGTH or not EMAIL_PATTERN.match(email):
            return jsonify({
                "success": False,
                "message": "Please enter a valid email address."
            }), 400

        if not password:
            return jsonify({
                "success": False,
                "message": "Password is required."
            }), 400

        if len(password) < 8:
            return jsonify({
                "success": False,
                "message": "Password must be at least 8 characters."
            }), 400


        # ---- Create user ----

        existing_user = User.query.filter_by(email=email).first()

        if existing_user:
            return jsonify({
                "success": False,
                "message": "An account with this email already exists."
            }), 409

        user = User(
            name=name,
            email=email,
            password_hash=hash_password(password),
        )

        db.session.add(user)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Account created successfully.",
            **_issue_tokens(user),
        }), 201


    except Exception as error:

        db.session.rollback()

        print("SIGNUP ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Unable to create account."
        }), 500


# =========================================================
# LOGIN
# =========================================================

@auth_bp.route("/login", methods=["POST"])
@limiter.limit("10 per minute")
def login():

    try:

        data = request.get_json(silent=True)

        if not data:
            return jsonify({
                "success": False,
                "message": "No data received."
            }), 400

        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not email or not password:
            return jsonify({
                "success": False,
                "message": "Email and password are required."
            }), 400

        user = User.query.filter_by(email=email).first()

        # Same generic message whether the email doesn't exist or
        # the password is wrong — never reveal which one it was.
        invalid_credentials = jsonify({
            "success": False,
            "message": "Invalid email or password."
        }), 401

        if not user:
            return invalid_credentials

        if not verify_password(user.password_hash, password):
            return invalid_credentials

        return jsonify({
            "success": True,
            "message": "Login successful.",
            **_issue_tokens(user),
        }), 200


    except Exception as error:

        print("LOGIN ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Unable to login."
        }), 500


# =========================================================
# CURRENT USER
# =========================================================

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():

    try:

        user_id = int(get_jwt_identity())

        user = db.session.get(User, user_id)

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found."
            }), 404

        return jsonify({
            "success": True,
            "user": user.to_public_dict(),
        }), 200

    except Exception as error:

        print("ME ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Unable to fetch account details."
        }), 500


# =========================================================
# REFRESH ACCESS TOKEN
# =========================================================

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():

    identity = get_jwt_identity()

    return jsonify({
        "success": True,
        "access_token": create_access_token(identity=identity),
    }), 200