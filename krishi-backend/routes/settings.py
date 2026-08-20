import os
import sqlite3

from flask import Blueprint, jsonify, request, session
from werkzeug.security import check_password_hash, generate_password_hash


settings_bp = Blueprint(
    "settings",
    __name__
)


BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

INSTANCE_DIR = os.path.join(
    BASE_DIR,
    "instance"
)

DATABASE = os.path.join(
    INSTANCE_DIR,
    "krishi.db"
)


def get_db():

    os.makedirs(
        INSTANCE_DIR,
        exist_ok=True
    )

    connection = sqlite3.connect(
        DATABASE
    )

    connection.row_factory = sqlite3.Row

    return connection

# for change password
@settings_bp.route(
    "/change-password",
    methods=["POST"]
)
def change_password():

    try:

        user_id = session.get("user_id")

        if not user_id:

            return jsonify({
                "success": False,
                "message": "You must be logged in."
            }), 401

        data = request.get_json()

        if not data:

            return jsonify({
                "success": False,
                "message": "No data received."
            }), 400

        current_password = data.get(
            "current_password",
            ""
        )

        new_password = data.get(
            "new_password",
            ""
        )

        if not current_password:

            return jsonify({
                "success": False,
                "message": "Current password is required."
            }), 400

        if not new_password:

            return jsonify({
                "success": False,
                "message": "New password is required."
            }), 400

        if len(new_password) < 8:

            return jsonify({
                "success": False,
                "message": "New password must be at least 8 characters."
            }), 400

        db = get_db()

        user = db.execute(
            """
            SELECT id, password
            FROM users
            WHERE id = ?
            """,
            (user_id,)
        ).fetchone()

        if not user:

            db.close()

            return jsonify({
                "success": False,
                "message": "User not found."
            }), 404

        if not check_password_hash(
            user["password"],
            current_password
        ):

            db.close()

            return jsonify({
                "success": False,
                "message": "Current password is incorrect."
            }), 401

        if check_password_hash(
            user["password"],
            new_password
        ):

            db.close()

            return jsonify({
                "success": False,
                "message": "New password must be different from your current password."
            }), 400

        hashed_password = generate_password_hash(
            new_password
        )

        db.execute(
            """
            UPDATE users
            SET password = ?
            WHERE id = ?
            """,
            (
                hashed_password,
                user_id
            )
        )

        db.commit()
        db.close()

        return jsonify({
            "success": True,
            "message": "Password changed successfully."
        }), 200

    except Exception as error:

        print(
            "CHANGE PASSWORD ERROR:",
            error
        )

        return jsonify({
            "success": False,
            "message": "Unable to change password."
        }), 500


@settings_bp.route(
    "/logout",
    methods=["POST"]
)
def logout():

    session.clear()

    return jsonify({
        "success": True,
        "message": "Logged out successfully."
    }), 200
