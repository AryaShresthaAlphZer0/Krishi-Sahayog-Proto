import { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import NEPAL_LOCATIONS from "../data/nepalLocations";
import Button from "../components/Button";
import { getCropLocation, saveCropLocation } from "../api/cropLocation";

import styles from "./CropInfoPage.module.css";


export default function CropInfoPage() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // "?edit=true" is used by the "Change location" link so a
  // returning user can update their saved location instead of
  // being auto-redirected straight to the results page
  const forceEdit = searchParams.get("edit") === "true";


  // =========================================================
  // "checking"  — figuring out whether they're logged in and
  //               whether they already have a saved location
  // "guest"     — not logged in, show the login prompt
  // "form"      — logged in, show the province/district form
  // =========================================================

  const [status, setStatus] = useState("checking");

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");

  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);


  // =========================================================
  // ON MOUNT — check login state, then ask the backend
  // whether this account already has a saved location
  // =========================================================

  useEffect(() => {

    let cancelled = false;

    async function init() {

      const hasUser = !!localStorage.getItem("user");

      if (!hasUser) {
        if (!cancelled) {
          setStatus("guest");
        }
        return;
      }

      try {

        const data = await getCropLocation();

        if (cancelled) {
          return;
        }

        const location = data?.location || null;

        if (location && !forceEdit) {

          // Already has a saved location — skip straight to
          // the results page instead of showing the form again
          navigate("/crop-recommendation/results", {
            replace: true,
            state: location,
          });

          return;
        }

        if (location) {
          setProvince(location.province);
          setDistrict(location.district);
        }

        setStatus("form");

      } catch {

        if (cancelled) {
          return;
        }

        // If the account truly isn't authenticated anymore,
        // axiosClient's own interceptor already handles clearing
        // storage and redirecting to /login. Any other failure
        // (network hiccup, server error) shouldn't block them
        // from filling out the form manually.
        setLoadError(
          "Couldn't check your saved location, but you can " +
          "still continue below."
        );

        setStatus("form");
      }
    }

    init();

    return () => {
      cancelled = true;
    };

  }, [forceEdit, navigate]);


  // =========================================================
  // DISTRICT OPTIONS (depend on selected province)
  // =========================================================

  const districtOptions = useMemo(() => {

    const match = NEPAL_LOCATIONS.find(
      (item) => item.province === province
    );

    return match ? match.districts : [];

  }, [province]);


  function handleProvinceChange(event) {

    setProvince(event.target.value);

    // Reset district whenever the province changes
    setDistrict("");
  }


  async function handleSubmit(event) {

    event.preventDefault();

    if (!province || !district || saving) {
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {

      await saveCropLocation(province, district);

      navigate("/crop-recommendation/results", {
        state: { province, district },
      });

    } catch (error) {

      setSaveError(
        error?.response?.data?.message ||
        "Couldn't save your location. Please try again."
      );

      setSaving(false);
    }
  }


  const canSubmit = province && district && !saving;


  // =========================================================
  // CHECKING — avoid flashing the wrong UI while we figure
  // out login state / saved location
  // =========================================================

  if (status === "checking") {

    return (
      <div className={styles.page}>
        <div className={styles.wrapper}>
          <p className={styles.checkingText}>
            Checking your account…
          </p>
        </div>
      </div>
    );
  }


  // =========================================================
  // NOT LOGGED IN — ask the user to log in first
  // =========================================================

  if (status === "guest") {

    return (
      <div className={styles.page}>

        <div className={styles.wrapper}>

          <div className={styles.authCard}>

            <div className={styles.authIcon}>
              🔒
            </div>

            <h1 className={styles.authTitle}>
              Log in to get crop recommendations
            </h1>

            <p className={styles.authText}>
              Create a free account or log in so we can save
              your province and district and skip this step
              next time.
            </p>

            <div className={styles.authButtons}>

              <Button to="/login" variant="primary">
                Log in
              </Button>

              <Button to="/signup" variant="outline">
                Create account
              </Button>

            </div>

          </div>

        </div>

      </div>
    );
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
            Where's your <em>farm</em> located?
          </h1>

          <p className={styles.subtitle}>
            {forceEdit
              ? "Update your saved location below."
              : "Tell us your province and district so we can tailor crop suggestions to your local soil and climate."}
          </p>

          {loadError && (
            <p className={styles.inlineWarning}>
              {loadError}
            </p>
          )}

        </div>


        {/* =====================================================
            FORM CARD
        ===================================================== */}

        <form
          className={styles.card}
          onSubmit={handleSubmit}
        >

          {/* PROVINCE */}

          <div className={styles.formGroup}>

            <label htmlFor="province">
              Province
            </label>

            <select
              id="province"
              value={province}
              onChange={handleProvinceChange}
              required
            >

              <option value="" disabled>
                Select your province
              </option>

              {NEPAL_LOCATIONS.map((item) => (
                <option
                  key={item.province}
                  value={item.province}
                >
                  {item.province}
                </option>
              ))}

            </select>

          </div>


          {/* DISTRICT */}

          <div className={styles.formGroup}>

            <label htmlFor="district">
              District
            </label>

            <select
              id="district"
              value={district}
              onChange={(event) =>
                setDistrict(event.target.value)
              }
              disabled={!province}
              required
            >

              <option value="" disabled>
                {province
                  ? "Select your district"
                  : "Select a province first"}
              </option>

              {districtOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}

            </select>

          </div>


          {saveError && (
            <p className={styles.formError}>
              {saveError}
            </p>
          )}


          {/* SUBMIT */}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!canSubmit}
          >
            {saving ? "Saving…" : "Continue"}
            {!saving && (
              <span className={styles.arrow}>→</span>
            )}
          </button>

        </form>

      </div>

    </div>
  );
}