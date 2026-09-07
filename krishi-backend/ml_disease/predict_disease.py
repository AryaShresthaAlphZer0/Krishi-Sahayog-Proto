"""
please vibecode your way out of this shithole:)

Requirements:
    pip install tensorflow pillow numpy
"""

import os
import sys

import numpy as np
from PIL import Image


ARCHITECTURE_JSON = "model/config.json"       # Keras architecture file (model.to_json() output)
WEIGHTS_PATH = "model/model.weights.h5"       # trained weights file
IMAGE_PATH = "leaf.jpeg"                # default image used when run with no args
SKIP_RESCALE = False                    # True only if model already has a Rescaling(1./255) layer built in

CLASS_NAMES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy",
]

IMG_SIZE = (224, 224)

_model_cache = None


def load_tf():
    import tensorflow as tf
    return tf


def preprocess_image(image_path, rescale=True):
    """
    Load an image from disk, resize to 224x224 (matching training resolution),
    convert to a normalized float32 array with a batch dimension.
    """
    img = Image.open(image_path).convert("RGB")
    img = img.resize(IMG_SIZE, Image.BILINEAR)

    arr = np.asarray(img, dtype=np.float32)
    if rescale:
        arr = arr / 255.0  # matches 

    arr = np.expand_dims(arr, axis=0)  # shape -> (1, 224, 224, 3)
    return arr


def format_label(raw_label):
    """
    PlantVillage folder names look like 'Tomato___Early_blight' or
    'Apple___healthy'. Turn that into a readable answer.
    """
    parts = raw_label.replace("___", "_").split("_")
    parts = [p for p in parts if p]
    plant = parts[0]
    condition = " ".join(parts[1:]) if len(parts) > 1 else "unknown"
    is_healthy = "healthy" in raw_label.lower()
    return plant, condition, is_healthy


def _get_model():
    """
    Rebuild the model from its architecture JSON, then load the trained
    weights into it. Cached after first call so repeated predictions don't
    reload the model from disk every time.
    """
    global _model_cache
    if _model_cache is None:
        if not os.path.exists(ARCHITECTURE_JSON):
            raise FileNotFoundError(
                f"Architecture file not found at: {ARCHITECTURE_JSON}. "
                f"Edit ARCHITECTURE_JSON at the top of this script if your file is named differently."
            )
        if not os.path.exists(WEIGHTS_PATH):
            raise FileNotFoundError(
                f"Weights file not found at: {WEIGHTS_PATH}. "
                f"Edit WEIGHTS_PATH at the top of this script if your file is named differently."
            )

        tf = load_tf()
        with open(ARCHITECTURE_JSON, "r") as f:
            arch_json = f.read()

        model = tf.keras.models.model_from_json(arch_json)
        model.load_weights(WEIGHTS_PATH)
        _model_cache = model
    return _model_cache


def _run_inference(image_path):
    """
    Shared logic: preprocess the image, run the model, and return a list of
    (class_name, confidence) for ALL classes, sorted by confidence descending.
    """
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found at: {image_path}")

    model = _get_model()
    x = preprocess_image(image_path, rescale=not SKIP_RESCALE)
    preds = model.predict(x, verbose=0)[0]  # shape -> (num_classes,)

    if len(preds) != len(CLASS_NAMES):
        raise ValueError(
            f"Model outputs {len(preds)} classes but CLASS_NAMES has {len(CLASS_NAMES)} "
            f"entries. Edit the CLASS_NAMES list at the top of this file to match "
            f"your model's actual classes."
        )

    order = preds.argsort()[::-1]  # descending confidence
    return [(CLASS_NAMES[i], float(preds[i])) for i in order]


def _print_summary(results, top_k=3):
    best_label, best_conf = results[0]
    plant, condition, is_healthy = format_label(best_label)

    print("\n=== Prediction ===")
    if is_healthy:
        print(f"The {plant} leaf appears HEALTHY. (confidence: {best_conf*100:.2f}%)")
    else:
        print(f"The {plant} leaf appears to have: {condition} (confidence: {best_conf*100:.2f}%)")

    print(f"\nTop {top_k} predictions:")
    for label, conf in results[:top_k]:
        p, c, h = format_label(label)
        status = "healthy" if h else c
        print(f"  {p:15s} -> {status:30s} {conf*100:6.2f}%")


def predict_top_class(image_path=IMAGE_PATH, verbose=True):
    """
    Run inference and return ONLY the single highest-confidence class.

        from predict_disease import predict_top_class
        label, confidence = predict_top_class("leaf.jpeg", verbose=False)

    Returns:
        A (class_name, confidence) tuple, e.g. ("Tomato___Early_blight", 0.87)
    """
    results = _run_inference(image_path)
    if verbose:
        _print_summary(results, top_k=1)
    return results[0]


def predict_all_classes(image_path=IMAGE_PATH, verbose=True):
    """
    Run inference and return confidences for ALL classes, sorted highest first.

        from predict_disease import predict_all_classes
        all_results = predict_all_classes("leaf.jpeg", verbose=False)
        for label, confidence in all_results:
            print(label, confidence)

    Returns:
        A list of (class_name, confidence) tuples for every class, e.g.:
            [("Tomato___Early_blight", 0.87), ("Tomato___Late_blight", 0.08), ...]
    """
    results = _run_inference(image_path)
    if verbose:
        _print_summary(results, top_k=len(results))
    return results


if __name__ == "__main__":

    img_path = sys.argv[1] if len(sys.argv) > 1 else IMAGE_PATH
    predict_top_class(img_path)
