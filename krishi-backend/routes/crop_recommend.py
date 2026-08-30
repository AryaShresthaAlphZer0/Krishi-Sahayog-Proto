from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from database.db import db
from database.models import CropRecommendation
from extensions import limiter
from ml.predict import predict_crop, METADATA


crop_recommend_bp = Blueprint("crop_recommend", __name__)


# Reasonable bounds, based on the training dataset's own min/max,
# with a little headroom either side. Rejects obviously bogus
# input (e.g. negative nitrogen, pH of 30) before it ever reaches
# the model.
BOUNDS = {
    "nitrogen": (0, 200),
    "phosphorus": (0, 200),
    "potassium": (0, 250),
    "ph": (0, 14),
    "temperature": (-10, 55),
    "humidity": (0, 100),
    "rainfall": (0, 600),
}


def _validate_number(data, key, bounds_key=None):

    value = data.get(key)

    if value is None:
        return None, f"{key} is required."

    try:
        value = float(value)
    except (TypeError, ValueError):
        return None, f"{key} must be a number."

    low, high = BOUNDS[bounds_key or key]

    if not (low <= value <= high):
        return None, f"{key} should be between {low} and {high}."

    return value, None


# =========================================================
# POST /api/crop-recommend
# body: { N, P, K, ph, temperature, humidity, rainfall,
#         province?, district? }
#
# temperature/humidity/rainfall are expected to come from the
# weather already fetched on the frontend for the user's saved
# location — this endpoint doesn't call the weather API itself,
# so it stays fast and doesn't duplicate that request.
# =========================================================

@crop_recommend_bp.route("", methods=["POST"])
@jwt_required()
@limiter.limit("20 per minute")
def recommend_crop():

    try:

        data = request.get_json(silent=True)

        if not data:
            return jsonify({
                "success": False,
                "message": "No data received."
            }), 400

        nitrogen, err = _validate_number(data, "N", "nitrogen")
        if err:
            return jsonify({"success": False, "message": err}), 400

        phosphorus, err = _validate_number(data, "P", "phosphorus")
        if err:
            return jsonify({"success": False, "message": err}), 400

        potassium, err = _validate_number(data, "K", "potassium")
        if err:
            return jsonify({"success": False, "message": err}), 400

        ph, err = _validate_number(data, "ph")
        if err:
            return jsonify({"success": False, "message": err}), 400

        temperature, err = _validate_number(data, "temperature")
        if err:
            return jsonify({"success": False, "message": err}), 400

        humidity, err = _validate_number(data, "humidity")
        if err:
            return jsonify({"success": False, "message": err}), 400

        rainfall, err = _validate_number(data, "rainfall")
        if err:
            return jsonify({"success": False, "message": err}), 400

        province = (data.get("province") or "").strip() or None
        district = (data.get("district") or "").strip() or None


        top_crop, top_confidence, top_predictions = predict_crop(
            nitrogen, phosphorus, potassium,
            temperature, humidity, ph, rainfall,
            top_k=6,
        )


        user_id = int(get_jwt_identity())

        record = db.session.get(CropRecommendation, user_id)

        if record:
            record.crop = top_crop
            record.confidence = top_confidence
            record.top_predictions = top_predictions
            record.nitrogen = nitrogen
            record.phosphorus = phosphorus
            record.potassium = potassium
            record.ph = ph
            record.temperature = temperature
            record.humidity = humidity
            record.rainfall = rainfall
            record.province = province
            record.district = district
        else:
            record = CropRecommendation(
                user_id=user_id,
                crop=top_crop,
                confidence=top_confidence,
                top_predictions=top_predictions,
                nitrogen=nitrogen,
                phosphorus=phosphorus,
                potassium=potassium,
                ph=ph,
                temperature=temperature,
                humidity=humidity,
                rainfall=rainfall,
                province=province,
                district=district,
            )
            db.session.add(record)

        db.session.commit()

        return jsonify({
            "success": True,
            "recommendation": record.to_public_dict(),
        }), 200

    except Exception as error:

        db.session.rollback()

        print("CROP RECOMMEND ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Unable to generate a recommendation."
        }), 500


# =========================================================
# GET /api/crop-recommend
# Returns the authenticated user's latest saved recommendation,
# or null if they haven't gotten one yet. This is what a future
# Dashboard widget would call.
# =========================================================

@crop_recommend_bp.route("", methods=["GET"])
@jwt_required()
def get_latest_recommendation():

    try:

        user_id = int(get_jwt_identity())

        record = db.session.get(CropRecommendation, user_id)

        if not record:
            return jsonify({
                "success": True,
                "recommendation": None,
            }), 200

        return jsonify({
            "success": True,
            "recommendation": record.to_public_dict(),
        }), 200

    except Exception as error:

        print("GET CROP RECOMMENDATION ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Unable to fetch saved recommendation."
        }), 500


# =========================================================
# GET /api/crop-recommend/info
# Small transparency endpoint — lets the frontend show the
# model's reported accuracy instead of hardcoding it.
# =========================================================

@crop_recommend_bp.route("/info", methods=["GET"])
def model_info():

    return jsonify({
        "success": True,
        "model_type": METADATA["model_type"],
        "held_out_test_accuracy": METADATA["held_out_test_accuracy"],
        "trained_on_rows": METADATA["trained_on_rows"],
        "classes": METADATA["classes"],
    }), 200