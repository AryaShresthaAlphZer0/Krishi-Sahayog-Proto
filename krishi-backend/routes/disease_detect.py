from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from extensions import limiter
from ml_disease.model import predict_disease
from ml_disease.labels import get_severity, get_remedy, format_display_name


disease_detect_bp = Blueprint("disease_detect", __name__)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


@disease_detect_bp.route("", methods=["POST"])
@jwt_required()
@limiter.limit("15 per minute")
def detect_disease():

    try:

        if "image" not in request.files:
            return jsonify({
                "success": False,
                "message": "No image file received."
            }), 400

        image_file = request.files["image"]

        if image_file.mimetype not in ALLOWED_TYPES:
            return jsonify({
                "success": False,
                "message": "Please upload a JPG, PNG, or WEBP image."
            }), 400

        image_bytes = image_file.read()

        if len(image_bytes) > MAX_SIZE_BYTES:
            return jsonify({
                "success": False,
                "message": "Image is over 10 MB — please upload a smaller file."
            }), 400

        predictions = predict_disease(image_bytes, top_k=3)

        top = predictions[0]
        crop, disease = format_display_name(top["class_name"])
        is_healthy = "healthy" in top["class_name"].lower()

        return jsonify({
            "success": True,
            "result": {
                "class_name": top["class_name"],
                "crop": crop,
                "disease": "Healthy" if is_healthy else disease,
                "is_healthy": is_healthy,
                "confidence": round(top["confidence"] * 100, 1),
                "severity": get_severity(top["class_name"]),
                "remedy": (
                    "No treatment needed — keep monitoring regularly."
                    if is_healthy
                    else get_remedy(top["class_name"])
                ),
                "alternatives": [
                    {
                        "class_name": p["class_name"],
                        "confidence": round(p["confidence"] * 100, 1),
                    }
                    for p in predictions[1:]
                ],
            },
        }), 200

    except Exception as error:

        print("DISEASE DETECT ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Unable to analyze the image. Please try again."
        }), 500