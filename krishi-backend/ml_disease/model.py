"""
Loads the MobileNetV2-based leaf disease model ONCE at process
start (not per-request — same reasoning as ml/predict.py for the
crop model) and exposes predict_disease(image_bytes).

Architecture reconstructed from the weights file's layer names
(MobileNetV2 base + GlobalAveragePooling2D + Dropout + Dense +
Dropout + Dense). load_weights() checks shapes strictly, so if
HIDDEN_UNITS below doesn't match your actual training script,
loading fails immediately with a shape-mismatch error that
states the expected shape — just read the number out of that
error and fix HIDDEN_UNITS, or paste the error back for a fix.
"""

import io
import os

import numpy as np
from PIL import Image
from tensorflow.keras import layers, models
from tensorflow.keras.applications.mobilenet_v2 import (
    MobileNetV2,
    preprocess_input,
)

from ml_disease.labels import CLASS_NAMES, NUM_CLASSES

IMG_SIZE = 224          # MobileNetV2 standard input size
HIDDEN_UNITS = 128      # Most common choice in this tutorial pattern — adjust if load fails

WEIGHTS_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "model_weights.weights.h5"
)


def _build_model():
    base = MobileNetV2(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        include_top=False,
        weights=None,
    )

    model = models.Sequential([
        base,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.2),
        layers.Dense(HIDDEN_UNITS, activation="relu"),
        layers.Dropout(0.2),
        layers.Dense(NUM_CLASSES, activation="softmax"),
    ])

    return model


_model = _build_model()
_model.load_weights(WEIGHTS_PATH)


def _preprocess(image_bytes):

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((IMG_SIZE, IMG_SIZE))

    array = np.array(image, dtype=np.float32)
    array = preprocess_input(array)

    return np.expand_dims(array, axis=0)


def predict_disease(image_bytes, top_k=3):

    batch = _preprocess(image_bytes)

    probabilities = _model.predict(batch, verbose=0)[0]

    ranked = sorted(
        zip(CLASS_NAMES, probabilities),
        key=lambda pair: pair[1],
        reverse=True,
    )

    return [
        {"class_name": name, "confidence": round(float(prob), 4)}
        for name, prob in ranked[:top_k]
    ]