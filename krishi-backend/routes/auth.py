import sqlite3
import os

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash


auth_bp = Blueprint("auth", __name__)


# =========================================================
# DATABASE
# =========================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INSTANCE_DIR = os.path.join(
    BASE_DIR,
    "instance"
)

DATABASE = os.path.join(
    INSTANCE_DIR,
    "krishi.db"
)


def get_db():
    os.makedirs(INSTANCE_DIR, exist_ok=True)

    connection = sqlite3.connect(DATABASE)

    connection.row_factory = sqlite3.Row

    return connection


def init_db():

    db = get_db()

    db.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    """)

    db.commit()

    db.close()


# Create database/table when backend starts
init_db()


# =========================================================
# SIGNUP
# =========================================================

@auth_bp.route("/signup", methods=["POST"])
def signup():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "No data received."
            }), 400


        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")


        # Validate fields

        if not name:
            return jsonify({
                "success": False,
                "message": "Name is required."
            }), 400


        if not email:
            return jsonify({
                "success": False,
                "message": "Email is required."
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


        db = get_db()


        # Check whether email already exists

        existing_user = db.execute(
            "SELECT id FROM users WHERE email = ?",
            (email,)
        ).fetchone()


        if existing_user:

            db.close()

            return jsonify({
                "success": False,
                "message": "An account with this email already exists."
            }), 409


        # Hash password before storing it

        hashed_password = generate_password_hash(
            password
        )


        # Insert user

        cursor = db.execute(
            """
            INSERT INTO users
            (name, email, password)
            VALUES (?, ?, ?)
            """,
            (
                name,
                email,
                hashed_password
            )
        )


        db.commit()


        user_id = cursor.lastrowid

        db.close()


        return jsonify({
            "success": True,
            "message": "Account created successfully.",
            "user": {
                "id": user_id,
                "name": name,
                "email": email
            }
        }), 201


    except Exception as error:

        print("SIGNUP ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Unable to create account."
        }), 500


# =========================================================
# LOGIN
# =========================================================

@auth_bp.route("/login", methods=["POST"])
def login():

    try:

        data = request.get_json()

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


        db = get_db()


        user = db.execute(
            """
            SELECT id, name, email, password
            FROM users
            WHERE email = ?
            """,
            (email,)
        ).fetchone()


        db.close()


        # User doesn't exist

        if not user:

            return jsonify({
                "success": False,
                "message": "Invalid email or password."
            }), 401


        # Check password

        if not check_password_hash(
            user["password"],
            password
        ):

            return jsonify({
                "success": False,
                "message": "Invalid email or password."
            }), 401


        return jsonify({
            "success": True,
            "message": "Login successful.",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"]
            }
        }), 200


    except Exception as error:

        print("LOGIN ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Unable to login."
        }), 500