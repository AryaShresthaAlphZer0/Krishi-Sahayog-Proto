from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from database.db import db
from database.models import CropLocation


crop_location_bp = Blueprint("crop_location", __name__)


# =========================================================
# GET SAVED LOCATION
# GET /api/crop-location
# Returns the *authenticated* user's saved location — never
# accepts a user id from the client, so one account can never
# read another account's data.
# =========================================================

@crop_location_bp.route("", methods=["GET"])
@jwt_required()
def get_crop_location():

    try:

        user_id = int(get_jwt_identity())

        location = db.session.get(CropLocation, user_id)

        if not location:
            return jsonify({
                "success": True,
                "location": None
            }), 200

        return jsonify({
            "success": True,
            "location": location.to_public_dict(),
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
# body: { province, district }
# The user is identified from the JWT — not from the body.
# =========================================================

@crop_location_bp.route("", methods=["PUT"])
@jwt_required()
def save_crop_location():

    try:

        data = request.get_json(silent=True)

        if not data:
            return jsonify({
                "success": False,
                "message": "No data received."
            }), 400

        province = (data.get("province") or "").strip()
        district = (data.get("district") or "").strip()

        if not province or not district:
            return jsonify({
                "success": False,
                "message": "Province and district are required."
            }), 400

        if len(province) > 80 or len(district) > 80:
            return jsonify({
                "success": False,
                "message": "Province/district name is too long."
            }), 400

        user_id = int(get_jwt_identity())

        location = db.session.get(CropLocation, user_id)

        if location:
            location.province = province
            location.district = district
        else:
            location = CropLocation(
                user_id=user_id,
                province=province,
                district=district,
            )
            db.session.add(location)

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Location saved.",
            "location": location.to_public_dict(),
        }), 200

    except Exception as error:

        db.session.rollback()

        print("SAVE CROP LOCATION ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Unable to save location."
        }), 500