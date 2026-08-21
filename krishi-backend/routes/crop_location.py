import sqlite3
import os
from datetime import datetime

from flask import Blueprint, request, jsonify


crop_location_bp = Blueprint("crop_location", __name__)


# =========================================================
# DATABASE
# (same krishi.db file used by routes/auth.py)
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
        CREATE TABLE IF NOT EXISTS crop_locations (
            user_id INTEGER PRIMARY KEY,
            province TEXT NOT NULL,
            district TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)

    db.commit()

    db.close()


# Create table when the app starts
init_db()


# =========================================================
# GET SAVED LOCATION
# GET /api/crop-location/<user_id>
# =========================================================

@crop_location_bp.route("/<int:user_id>", methods=["GET"])
def get_crop_location(user_id):

    try:

        db = get_db()

        row = db.execute(
            """
            SELECT province, district
            FROM crop_locations
            WHERE user_id = ?
            """,
            (user_id,)
        ).fetchone()

        db.close()

        if not row:
            return jsonify({
                "success": True,
                "location": None
            }), 200

        return jsonify({
            "success": True,
            "location": {
                "province": row["province"],
                "district": row["district"]
            }
        }), 200

    except Exception as error:

        print("GET CROP LOCATION ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Unable to fetch saved location."
        }), 500


# =========================================================
# SAVE / UPDATE LOCATION
# PUT /api/crop-location
# body: { user_id, province, district }
# =========================================================

@crop_location_bp.route("", methods=["PUT"])
def save_crop_location():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "No data received."
            }), 400


        user_id = data.get("user_id")
        province = (data.get("province") or "").strip()
        district = (data.get("district") or "").strip()


        if not user_id:
            return jsonify({
                "success": False,
                "message": "user_id is required."
            }), 400


        if not province or not district:
            return jsonify({
                "success": False,
                "message": "Province and district are required."
            }), 400


        db = get_db()


        # Confirm the user actually exists

        user = db.execute(
            "SELECT id FROM users WHERE id = ?",
            (user_id,)
        ).fetchone()

        if not user:

            db.close()

            return jsonify({
                "success": False,
                "message": "User not found."
            }), 404


        # Upsert — one saved location per user

        db.execute(
            """
            INSERT INTO crop_locations
                (user_id, province, district, updated_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                province = excluded.province,
                district = excluded.district,
                updated_at = excluded.updated_at
            """,
            (
                user_id,
                province,
                district,
                datetime.utcnow().isoformat()
            )
        )

        db.commit()

        db.close()

        return jsonify({
            "success": True,
            "message": "Location saved.",
            "location": {
                "province": province,
                "district": district
            }
        }), 200

    except Exception as error:

        print("SAVE CROP LOCATION ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Unable to save location."
        }), 500