"""
Trains the crop recommendation classifier.

Run this manually whenever the dataset changes:
    python3 ml/train_model.py

It is NOT run on every server request — app.py just loads the
saved model/scaler files this script produces. That's what makes
this approach scalable: inference is a fast in-memory prediction,
not a retrain.
"""

import json
import os

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "Crop_recommendation.csv")
MODEL_DIR = os.path.join(BASE_DIR, "model")

FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
TARGET = "label"


def main():

    df = pd.read_csv(DATA_PATH)

    X = df[FEATURES]
    y = df[TARGET]

    print(f"Dataset: {len(df)} rows, {y.nunique()} crop classes")


    # =====================================================
    # HONEST EVALUATION — split first, fit scaler on the
    # training split only, so the reported accuracy isn't
    # inflated by information leaking in from the test set.
    # =====================================================

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    eval_scaler = StandardScaler()
    X_train_scaled = eval_scaler.fit_transform(X_train)
    X_test_scaled = eval_scaler.transform(X_test)

    candidates = {
        "random_forest": RandomForestClassifier(
            n_estimators=300, random_state=42
        ),
        "decision_tree": DecisionTreeClassifier(random_state=42),
        "knn": KNeighborsClassifier(n_neighbors=5),
        "svm": SVC(kernel="rbf", probability=True, random_state=42),
    }

    print("\nModel comparison (5-fold cross-validation on training split):")

    scores = {}

    for name, model in candidates.items():

        model.fit(X_train_scaled, y_train)
        test_preds = model.predict(X_test_scaled)
        test_acc = accuracy_score(y_test, test_preds)

        cv = cross_val_score(model, X_train_scaled, y_train, cv=5)

        scores[name] = {
            "test_accuracy": test_acc,
            "cv_mean": cv.mean(),
        }

        print(
            f"  {name:15s}  test_accuracy={test_acc:.4f}"
            f"  cv_mean={cv.mean():.4f}"
        )

    best_name = max(scores, key=lambda k: scores[k]["cv_mean"])
    best_test_acc = scores[best_name]["test_accuracy"]
    best_cv_mean = scores[best_name]["cv_mean"]

    print(f"\nBest model: {best_name}")
    print(
        classification_report(
            y_test,
            candidates[best_name].predict(X_test_scaled),
            zero_division=0,
        )
    )


    # =====================================================
    # FINAL ARTIFACT — retrain the winning model type on the
    # FULL dataset (more data = better real-world predictions),
    # but keep the honest held-out accuracy above for reporting.
    # =====================================================

    final_scaler = StandardScaler()
    X_scaled_full = final_scaler.fit_transform(X)

    final_model = type(candidates[best_name])(
        **candidates[best_name].get_params()
    )
    final_model.fit(X_scaled_full, y)

    os.makedirs(MODEL_DIR, exist_ok=True)

    joblib.dump(final_model, os.path.join(MODEL_DIR, "crop_model.joblib"))
    joblib.dump(final_scaler, os.path.join(MODEL_DIR, "scaler.joblib"))

    metadata = {
        "model_type": best_name,
        "features": FEATURES,
        "classes": sorted(y.unique().tolist()),
        "held_out_test_accuracy": round(best_test_acc, 4),
        "cross_val_mean_accuracy": round(best_cv_mean, 4),
        "trained_on_rows": len(df),
    }

    with open(os.path.join(MODEL_DIR, "metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\nSaved model + scaler + metadata to {MODEL_DIR}")
    print(json.dumps(metadata, indent=2))


if __name__ == "__main__":
    main()