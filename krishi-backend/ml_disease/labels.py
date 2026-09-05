"""
Class labels for the uploaded MobileNetV2 model.

The weights file has no embedded class names (weight files never
store semantic labels, regardless of tooling) — this is the
standard 38-class PlantVillage label order, inferred from the
model's architecture fingerprint (MobileNetV2 + GAP + Dense head
is the near-universal pattern for PlantVillage tutorials).

If your training notebook used a different class order or a
different dataset, replace CLASS_NAMES below with your actual
list (same order as training) — everything else in this file
still works unchanged.
"""

CLASS_NAMES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry___Powdery_mildew",
    "Cherry___healthy",
    "Corn___Cercospora_leaf_spot",
    "Corn___Common_rust",
    "Corn___Northern_Leaf_Blight",
    "Corn___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight",
    "Grape___healthy",
    "Orange___Huanglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper_bell___Bacterial_spot",
    "Pepper_bell___healthy",
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
    "Tomato___Spider_mites",
    "Tomato___Target_Spot",
    "Tomato___Yellow_Leaf_Curl_Virus",
    "Tomato___mosaic_virus",
    "Tomato___healthy",
]

NUM_CLASSES = len(CLASS_NAMES)


# Specific remedies for the more common/severe classes; anything
# not listed falls back to DEFAULT_REMEDY below.
REMEDY_MAP = {
    "Apple___Apple_scab": "Remove fallen infected leaves, prune for airflow, and apply a fungicide (captan or myclobutanil) starting at bud break.",
    "Apple___Black_rot": "Prune out cankers and mummified fruit, and apply a fungicide during the growing season.",
    "Apple___Cedar_apple_rust": "Remove nearby juniper hosts if possible, and apply a fungicide from pink bud stage through petal fall.",
    "Corn___Common_rust": "Plant resistant hybrids where available; fungicide is rarely needed unless infection is severe and early.",
    "Corn___Northern_Leaf_Blight": "Rotate away from corn for a season, use resistant hybrids, and apply a fungicide if detected early.",
    "Grape___Black_rot": "Remove mummified berries and infected leaves, and apply a fungicide from early shoot growth through veraison.",
    "Orange___Huanglongbing_(Citrus_greening)": "No cure exists — remove and destroy infected trees to slow spread, and control the psyllid insect vector.",
    "Peach___Bacterial_spot": "Use resistant varieties, avoid overhead irrigation, and apply a copper-based bactericide during dormancy.",
    "Potato___Early_blight": "Remove infected lower leaves, avoid overhead watering, and apply a copper-based fungicide every 7–10 days.",
    "Potato___Late_blight": "Remove infected foliage immediately, avoid overhead watering, and apply a copper-based fungicide before wet weather sets in.",
    "Squash___Powdery_mildew": "Improve air circulation between plants, avoid wetting leaves when watering, and apply sulfur-based fungicide or neem oil.",
    "Strawberry___Leaf_scorch": "Remove infected leaves after harvest, avoid overhead watering, and apply a fungicide if recurring.",
    "Tomato___Bacterial_spot": "Use disease-free seed, avoid overhead watering, and apply a copper-based bactericide early.",
    "Tomato___Early_blight": "Remove infected lower leaves, avoid overhead watering, and apply a copper-based fungicide every 7–10 days.",
    "Tomato___Late_blight": "Remove infected foliage immediately, avoid overhead watering, and apply a copper-based fungicide before wet weather sets in.",
    "Tomato___Yellow_Leaf_Curl_Virus": "No cure exists — remove infected plants and control whiteflies, the primary vector, with sticky traps or insecticide.",
    "Tomato___mosaic_virus": "No cure exists — remove and destroy infected plants, and wash hands/tools between plants to avoid spreading it.",
}

DEFAULT_REMEDY = (
    "Remove and isolate affected leaves, avoid overhead watering, "
    "and monitor closely — consider a general-purpose fungicide or "
    "bactericide if it spreads."
)


def get_severity(class_name):
    """Cheap keyword-based severity tag — not a clinical assessment."""

    if "healthy" in class_name.lower():
        return "Healthy"

    severe_keywords = ["blight", "rust", "virus", "wilt", "rot", "greening"]

    if any(k in class_name.lower() for k in severe_keywords):
        return "Severe"

    return "Moderate"


def get_remedy(class_name):
    return REMEDY_MAP.get(class_name, DEFAULT_REMEDY)


def format_display_name(class_name):
    """'Tomato___Early_blight' -> ('Tomato', 'Early blight')"""

    parts = class_name.split("___")

    crop = parts[0].replace("_", " ").strip()
    disease = parts[1].replace("_", " ").strip() if len(parts) > 1 else "healthy"

    return crop, disease