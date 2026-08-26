import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

import { getCropLocation } from "../api/cropLocation";
import { getWeather } from "../api/weather";
import {
  predictCrop,
  getLatestRecommendation,
  getModelInfo,
} from "../api/cropRecommend";
import {
  getWeatherInfo,
  formatDayLabel,
  formatFullDate,
} from "../utils/weatherCodes";
import { formatCropName } from "../utils/cropIcons";
import { getMatchReasons } from "../utils/cropReasons";
import CROP_FACTS from "../data/cropFacts";
import CropImage from "../components/CropImage";

import styles from "./CropRecommendationPage.module.css";


const SOIL_PRESETS = [
  { label: "Loamy & Balanced", nitrogen: 60, phosphorus: 55, potassium: 50, ph: 6.5 },
  { label: "Acidic & Low-N", nitrogen: 20, phosphorus: 40, potassium: 30, ph: 5.2 },
  { label: "Rich & Alkaline", nitrogen: 100, phosphorus: 90, potassium: 90, ph: 7.8 },
];

export default function CropRecommendationPage() {

  const navigate = useNavigate();
  const location = useLocation();


  // =========================================================
  // RESOLVE THE LOCATION
  // Router state is the fast path (set when arriving from the
  // info form). If it's missing — e.g. the page was refreshed —
  // fall back to asking the backend for the saved location.
  // =========================================================

  const [resolvedLocation, setResolvedLocation] = useState(
    location.state || null
  );

  const [resolving, setResolving] = useState(!location.state);


  useEffect(() => {

    if (location.state) {
      return;
    }

    let cancelled = false;

    async function resolve() {

      try {

        const data = await getCropLocation();

        if (cancelled) {
          return;
        }

        if (data?.location) {
          setResolvedLocation(data.location);
        } else {
          navigate("/crop-recommendation", { replace: true });
        }

      } catch {

        if (cancelled) {
          return;
        }

        navigate("/crop-recommendation", { replace: true });

      } finally {

        if (!cancelled) {
          setResolving(false);
        }
      }
    }

    resolve();

    return () => {
      cancelled = true;
    };

  }, [location.state, navigate]);


  const { province, district } = resolvedLocation || {};


  // =========================================================
  // GUARD — send the user back if there's no location at all
  // once resolution has finished (guests, or accounts with
  // nothing saved yet)
  // =========================================================

  useEffect(() => {

    if (!resolving && (!province || !district)) {
      navigate("/crop-recommendation", { replace: true });
    }

  }, [resolving, province, district, navigate]);


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


  // =========================================================
  // CROP RECOMMENDATION (ML)
  // =========================================================

  const [recommendation, setRecommendation] = useState(null);
  const [recLoading, setRecLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [modelInfo, setModelInfo] = useState(null);

  const [nitrogen, setNitrogen] = useState(60);
  const [phosphorus, setPhosphorus] = useState(50);
  const [potassium, setPotassium] = useState(50);
  const [ph, setPh] = useState(6.5);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);


  function applyPreset(preset) {
    setNitrogen(preset.nitrogen);
    setPhosphorus(preset.phosphorus);
    setPotassium(preset.potassium);
    setPh(preset.ph);
  }


  function resetSoilValues() {
    setNitrogen(60);
    setPhosphorus(50);
    setPotassium(50);
    setPh(6.5);
    setSubmitError(null);
  }


  // Load any previously saved recommendation, and the model's
  // reported accuracy, once on mount
  useEffect(() => {

    let cancelled = false;

    async function init() {

      try {

        const data = await getLatestRecommendation();

        if (cancelled) {
          return;
        }

        if (data?.recommendation) {

          setRecommendation(data.recommendation);

          const inputs = data.recommendation.inputs;

          setNitrogen(inputs.nitrogen);
          setPhosphorus(inputs.phosphorus);
          setPotassium(inputs.potassium);
          setPh(inputs.ph);

        } else {

          setShowForm(true);
        }

      } catch {

        if (!cancelled) {
          setShowForm(true);
        }

      } finally {

        if (!cancelled) {
          setRecLoading(false);
        }
      }
    }

    init();

    getModelInfo()
      .then((data) => {
        if (!cancelled && data.success) {
          setModelInfo(data);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };

  }, []);


  async function handlePredict(event) {

    event.preventDefault();

    if (!today) {
      setSubmitError(
        "Still loading this week's weather — try again in a moment."
      );
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    // temperature/humidity come from today's forecast. Rainfall
    // is approximated as the sum of the 7-day forecast, since the
    // model was trained on seasonal rainfall totals, not a single
    // day's figure — the closest proxy this weather API can give.
    const temperature = (today.temp_max + today.temp_min) / 2;
    const humidity = today.humidity;
    const rainfall = (weather?.days || []).reduce(
      (sum, day) => sum + (day.precipitation_sum || 0),
      0
    );

    try {

      const data = await predictCrop({
        N: nitrogen,
        P: phosphorus,
        K: potassium,
        ph,
        temperature,
        humidity,
        rainfall,
        province,
        district,
      });

      if (data.success) {
        setRecommendation(data.recommendation);
        setShowForm(false);
      } else {
        setSubmitError(
          data.message || "Couldn't generate a recommendation."
        );
      }

    } catch (error) {

      setSubmitError(
        error?.response?.data?.message ||
        "Couldn't generate a recommendation. Please try again."
      );

    } finally {

      setSubmitting(false);
    }
  }


  if (resolving || !province || !district) {
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
            SOIL INPUT FORM (sliders)
        ===================================================== */}

        {!recLoading && showForm && (

          <div className={styles.soilCard}>

            <div className={styles.soilCardHeader}>

              <p className={styles.soilCardHint}>
                Drag each slider to match your soil test results.
              </p>

              <div className={styles.presetRow}>
                {SOIL_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset.label}
                    className={styles.presetChip}
                    onClick={() => applyPreset(preset)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

            </div>

            <form onSubmit={handlePredict}>

              <div className={styles.soilGrid}>

                <SoilSlider
                  id="nitrogen"
                  symbol="N"
                  label="Nitrogen"
                  unit="kg/ha"
                  min={0}
                  max={140}
                  value={nitrogen}
                  onChange={setNitrogen}
                  tone="primary"
                />

                <SoilSlider
                  id="phosphorus"
                  symbol="P"
                  label="Phosphorus"
                  unit="kg/ha"
                  min={0}
                  max={145}
                  value={phosphorus}
                  onChange={setPhosphorus}
                  tone="accent"
                />

                <SoilSlider
                  id="potassium"
                  symbol="K"
                  label="Potassium"
                  unit="kg/ha"
                  min={0}
                  max={205}
                  value={potassium}
                  onChange={setPotassium}
                  tone="primary"
                />

                <SoilSlider
                  id="ph"
                  symbol="pH"
                  label="Soil pH"
                  unit=""
                  min={3.5}
                  max={9.5}
                  step={0.1}
                  value={ph}
                  onChange={setPh}
                  tone="accent"
                />

              </div>

              {submitError && (
                <p className={styles.formError}>
                  {submitError}
                </p>
              )}

              <div className={styles.soilActions}>

                <button
                  type="submit"
                  className={styles.predictBtn}
                  disabled={submitting || !today}
                >
                  {submitting ? "Analyzing…" : "🌿 Recommend Crops"}
                </button>

                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={resetSoilValues}
                >
                  Reset
                </button>

              </div>

              <p className={styles.recDisclaimer}>
                Temperature and humidity come from today's
                forecast above. Rainfall is estimated from the
                7-day forecast total, since the model was
                trained on seasonal rainfall figures rather
                than a single day's reading — treat it as a
                helpful estimate, not a precise agronomic
                measurement.
                {modelInfo && (
                  <>
                    {" "}Model accuracy on held-out test data:
                    {" "}{Math.round(modelInfo.held_out_test_accuracy * 100)}%.
                  </>
                )}
              </p>

            </form>

          </div>
        )}


        {/* =====================================================
            RESULTS — "Your recommended harvest"
        ===================================================== */}

        {recLoading && (
          <p className={styles.checkingRecText}>
            Checking for a saved recommendation…
          </p>
        )}

        {!recLoading && recommendation && !showForm && (

          <div className={styles.harvestSection}>

            <div className={styles.harvestHeaderRow}>

              <h2 className={styles.harvestHeading}>
                🌿 Your recommended harvest
              </h2>

              <button
                type="button"
                className={styles.recalcBtn}
                onClick={() => setShowForm(true)}
              >
                Recalculate with new soil values
              </button>

            </div>

            <div className={styles.harvestGrid}>

              {recommendation.top_predictions.map((item, index) => {

                const facts = CROP_FACTS[item.crop];
                const reasons = getMatchReasons(
                  recommendation.inputs,
                  facts
                );
                const matchPercent = Math.round(item.confidence * 100);
                const isBest = index === 0;

                return (
                  <div
                    key={item.crop}
                    className={[
                      styles.harvestCard,
                      isBest ? styles.harvestCardBest : "",
                    ].join(" ")}
                  >

                    {isBest && (
                      <span className={styles.bestBadge}>
                        Best match
                      </span>
                    )}

                    <div className={styles.harvestCardTop}>

                      <CropImage crop={item.crop} />

                      <div>
                        <span className={styles.harvestRank}>
                          #{index + 1} · {facts?.category || "Crop"}
                        </span>
                        <span className={styles.harvestCropName}>
                          {formatCropName(item.crop)}
                        </span>
                      </div>

                    </div>

                    <div className={styles.matchRow}>
                      <span className={styles.matchLabel}>
                        Match score
                      </span>
                      <span className={styles.matchValue}>
                        {matchPercent}%
                      </span>
                    </div>

                    <div className={styles.matchBarTrack}>
                      <div
                        className={styles.matchBarFill}
                        style={{ width: `${matchPercent}%` }}
                      />
                    </div>

                    {reasons.length > 0 && (
                      <ul className={styles.reasonList}>
                        {reasons.map((reason) => (
                          <li key={reason}>
                            🌱 {reason}
                          </li>
                        ))}
                      </ul>
                    )}

                    {facts && (
                      <>
                        <div className={styles.harvestDivider} />

                        <div className={styles.miniChipsRow}>
                          <span className={styles.miniChip}>
                            ⏱ {facts.duration}
                          </span>
                          <span className={styles.miniChip}>
                            📦 {facts.yieldNote}
                          </span>
                          <span className={styles.miniChip}>
                            pH {facts.phRange[0]}–{facts.phRange[1]}
                          </span>
                        </div>

                        <p className={styles.harvestTip}>
                          {facts.tip}
                        </p>
                      </>
                    )}

                  </div>
                );
              })}

            </div>

            <p className={styles.harvestDisclaimer}>
              Growing duration and yield figures are general
              reference ranges — actual results vary by variety,
              climate, and farming practice.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}


// =========================================================
// A single labeled range slider used in the soil input form
// =========================================================

function SoilSlider({
  id,
  symbol,
  label,
  unit,
  min,
  max,
  step = 1,
  value,
  onChange,
  tone,
}) {

  return (
    <div
      className={[
        styles.soilField,
        tone === "accent" ? styles.soilFieldAccent : styles.soilFieldPrimary,
      ].join(" ")}
    >

      <div className={styles.soilFieldTop}>

        <span className={styles.soilFieldIcon}>
          {symbol}
        </span>

        <label htmlFor={id}>
          {label}
        </label>

        <span className={styles.soilFieldValue}>
          {value}
          {unit && (
            <span className={styles.soilFieldUnit}>
              {" "}{unit}
            </span>
          )}
        </span>

      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(parseFloat(event.target.value))}
        className={styles.slider}
      />

      <div className={styles.sliderMinMax}>
        <span>{min}</span>
        <span>{max}</span>
      </div>

    </div>
  );
}