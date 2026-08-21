import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

import { getWeather } from "../api/weather";
import {
  getWeatherInfo,
  formatDayLabel,
  formatFullDate,
} from "../utils/weatherCodes";

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


  // =========================================================
  // WEATHER
  // =========================================================

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);


  useEffect(() => {

    async function loadWeather() {

      if (!province || !district) {
        return;
      }

      setWeatherLoading(true);
      setWeatherError(null);

      try {

        const data = await getWeather(province, district);

        if (data.success) {
          setWeather(data);
        } else {
          setWeatherError(
            data.message || "Couldn't load the weather forecast."
          );
        }

      } catch (error) {

        setWeatherError(
          error?.response?.data?.message ||
          "Couldn't reach the weather service. Please try again."
        );

      } finally {

        setWeatherLoading(false);
      }
    }


    loadWeather();

  }, [province, district, retryCount]);


  if (!province || !district) {
    return null;
  }


  const today = weather?.days?.[0];
  const upcoming = weather?.days?.slice(1, 7) || [];


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
            Here's the forecast for your farm this week.
          </p>

          <Link
            to="/crop-recommendation?edit=true"
            className={styles.changeLink}
          >
            ← Change location
          </Link>

        </div>


        {/* =====================================================
            WEATHER — LOADING
        ===================================================== */}

        {weatherLoading && (
          <div className={styles.weatherSkeleton}>

            <div className={styles.skeletonHero}>
              <div className={styles.skeletonPulse} />
            </div>

            <div className={styles.skeletonStrip}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={styles.skeletonDay}
                >
                  <div className={styles.skeletonPulse} />
                </div>
              ))}
            </div>

          </div>
        )}


        {/* =====================================================
            WEATHER — ERROR
        ===================================================== */}

        {!weatherLoading && weatherError && (
          <div className={styles.weatherErrorCard}>

            <div className={styles.weatherErrorIcon}>
              ⚠️
            </div>

            <h2 className={styles.weatherErrorTitle}>
              Couldn't load the forecast
            </h2>

            <p className={styles.weatherErrorText}>
              {weatherError}
            </p>

            <button
              type="button"
              className={styles.retryBtn}
              onClick={() => setRetryCount((n) => n + 1)}
            >
              Try again
            </button>

          </div>
        )}


        {/* =====================================================
            WEATHER — LOADED
        ===================================================== */}

        {!weatherLoading && !weatherError && today && (

          <div className={styles.weatherBlock}>

            {/* TODAY HERO */}

            <div className={styles.hero}>

              <div className={styles.heroGlowOne} />
              <div className={styles.heroGlowTwo} />

              <div className={styles.heroTop}>

                <div>
                  <span className={styles.heroEyebrow}>
                    Today · {formatFullDate(today.date)}
                  </span>

                  <div className={styles.heroTempRow}>
                    <span className={styles.heroIcon}>
                      {getWeatherInfo(today.weather_code).icon}
                    </span>

                    <span className={styles.heroTemp}>
                      {Math.round(today.temp_max)}°
                    </span>
                  </div>

                  <span className={styles.heroCondition}>
                    {getWeatherInfo(today.weather_code).label}
                  </span>
                </div>

              </div>

              <div className={styles.heroStats}>

                <div className={styles.statChip}>
                  <span className={styles.statLabel}>
                    High / Low
                  </span>
                  <span className={styles.statValue}>
                    {Math.round(today.temp_max)}° / {Math.round(today.temp_min)}°
                  </span>
                </div>

                <div className={styles.statChip}>
                  <span className={styles.statLabel}>
                    Humidity
                  </span>
                  <span className={styles.statValue}>
                    {Math.round(today.humidity)}%
                  </span>
                </div>

                <div className={styles.statChip}>
                  <span className={styles.statLabel}>
                    Rain chance
                  </span>
                  <span className={styles.statValue}>
                    {Math.round(today.precipitation_probability)}%
                  </span>
                </div>

                <div className={styles.statChip}>
                  <span className={styles.statLabel}>
                    Wind
                  </span>
                  <span className={styles.statValue}>
                    {Math.round(today.wind_max)} km/h
                  </span>
                </div>

                <div className={styles.statChip}>
                  <span className={styles.statLabel}>
                    Rainfall
                  </span>
                  <span className={styles.statValue}>
                    {today.precipitation_sum} mm
                  </span>
                </div>

              </div>

            </div>


            {/* NEXT 6 DAYS */}

            <div className={styles.forecastSection}>

              <h3 className={styles.forecastHeading}>
                Next 6 days
              </h3>

              <div className={styles.forecastStrip}>

                {upcoming.map((day, index) => {

                  const info = getWeatherInfo(day.weather_code);

                  return (
                    <div
                      key={day.date}
                      className={styles.dayCard}
                    >

                      <span className={styles.dayName}>
                        {formatDayLabel(day.date, index + 1)}
                      </span>

                      <span className={styles.dayIcon}>
                        {info.icon}
                      </span>

                      <span className={styles.dayHigh}>
                        {Math.round(day.temp_max)}°
                      </span>

                      <span className={styles.dayLow}>
                        {Math.round(day.temp_min)}°
                      </span>

                      <span className={styles.dayRain}>
                        💧 {Math.round(day.precipitation_probability)}%
                      </span>

                    </div>
                  );
                })}

              </div>

            </div>

          </div>
        )}


        {/* =====================================================
            RECOMMENDATION PLACEHOLDER
            (crop recommendation logic goes here next)
        ===================================================== */}

        <div className={styles.resultCard}>

          <h2 className={styles.resultTitle}>
            Recommended crops
          </h2>

          <p className={styles.resultText}>
            Once your crop recommendation model is connected,
            personalized suggestions for {district} — based on
            this week's weather — will appear here.
          </p>

        </div>

      </div>

    </div>
  );
}