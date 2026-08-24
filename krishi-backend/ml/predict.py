"""
Loads the trained crop model once at import time and exposes a
simple predict() function. Keeping this separate from the route
file means the (relatively expensive) model/scaler load only
happens once per server process, not on every request.
"""

import json
import os

import joblib
import pandas as pd


MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "model")

_model = joblib.load(os.path.join(MODEL_DIR, "crop_model.joblib"))
_scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.joblib"))

with open(os.path.join(MODEL_DIR, "metadata.json")) as f:
    METADATA = json.load(f)

FEATURES = METADATA["features"]


def predict_crop(n, p, k, temperature, humidity, ph, rainfall, top_k=3):
    """
    Returns (top_crop, top_confidence, top_predictions) where
    top_predictions is a list of {"crop": ..., "confidence": ...}
    for the top_k most likely crops, sorted by confidence desc.
    """

    # Built as a DataFrame with the same column names/order used
    # during training, so scikit-learn doesn't warn about missing
    # feature names and column order can't silently drift.
    row = pd.DataFrame(
        [[n, p, k, temperature, humidity, ph, rainfall]],
        columns=FEATURES,
    )

    scaled = _scaler.transform(row)

    probabilities = _model.predict_proba(scaled)[0]

    classes = _model.classes_

    ranked = sorted(
        zip(classes, probabilities),
        key=lambda pair: pair[1],
        reverse=True,
    )

    top_predictions = [
        {"crop": crop, "confidence": round(float(prob), 4)}
        for crop, prob in ranked[:top_k]
    ]

    top_crop, top_confidence = top_predictions[0]["crop"], top_predictions[0]["confidence"]

    return top_crop, top_confidence, top_predictions