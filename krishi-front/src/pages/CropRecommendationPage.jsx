import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

import styles from "./CropRecommendationPage.module.css";

export default function CropRecommendationPage() {

  const navigate = useNavigate();
  const location = useLocation();


  // =========================================================
  // FALL BACK TO SAVED LOCATION
  // Router state is lost on a page refresh, so fall back to
  // the logged-in user's saved crop location in that case.
  // =========================================================

  const fallbackLocation = useMemo(() => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user) {
        return null;
      }

      const raw = localStorage.getItem(
        `krishi_crop_location_${user.id}`
      );

      return raw ? JSON.parse(raw) : null;

    } catch {

      return null;
    }

  }, []);

  const { province, district } =
    location.state || fallbackLocation || {};


  // =========================================================
  // GUARD — send the user back if there's no location on
  // file at all (guests, or logged-in users with none saved)
  // =========================================================

  useEffect(() => {

    if (!province || !district) {
      navigate("/crop-recommendation", { replace: true });
    }

  }, [province, district, navigate]);


  if (!province || !district) {
    return null;
  }


  return (
    <div className={styles.page}>

      <div className={styles.wrapper}>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className={styles.header}>

          <span className={styles.eyebrow}>
            Crop Recommendation
          </span>

          <h1 className={styles.title}>
            {district}, <em>{province}</em>
          </h1>

          <p className={styles.subtitle}>
            Here's what we know about your location so far.
          </p>

          <Link
            to="/crop-recommendation?edit=true"
            className={styles.changeLink}
          >
            ← Change location
          </Link>

        </div>


        {/* =====================================================
            WEATHER CARD (placeholder — not integrated yet)
        ===================================================== */}

        <div className={styles.weatherCard}>

          <div className={styles.weatherIcon}>
            🌦️
          </div>

          <h2 className={styles.weatherTitle}>
            Weather data coming soon
          </h2>

          <p className={styles.weatherText}>
            We'll show live temperature, rainfall, humidity, and
            a seasonal outlook for {district} here, and use it
            to power your crop recommendations.
          </p>

          <span className={styles.badge}>
            Not yet connected
          </span>

        </div>


        {/* =====================================================
            RECOMMENDATION PLACEHOLDER
        ===================================================== */}

        <div className={styles.resultCard}>

          <h2 className={styles.resultTitle}>
            Recommended crops
          </h2>

          <p className={styles.resultText}>
            Once weather and soil data are connected, your
            personalized crop recommendations for {district}
            will appear here.
          </p>

        </div>

      </div>

    </div>
  );
}