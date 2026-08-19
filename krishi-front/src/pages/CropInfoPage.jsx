import { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import NEPAL_LOCATIONS from "../data/nepalLocations";
import Button from "../components/Button";

import styles from "./CropInfoPage.module.css";


// =========================================================
// LOCAL STORAGE HELPERS
// (crop location is remembered per logged-in user)
// =========================================================

function getStoredLocation(userId) {

  if (!userId) {
    return null;
  }

  try {

    const raw = localStorage.getItem(
      `krishi_crop_location_${userId}`
    );

    return raw ? JSON.parse(raw) : null;

  } catch {

    return null;
  }
}


function saveStoredLocation(userId, location) {

  if (!userId) {
    return;
  }

  localStorage.setItem(
    `krishi_crop_location_${userId}`,
    JSON.stringify(location)
  );
}


export default function CropInfoPage() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // "?edit=true" is used by the "Change location" link so a
  // returning user can update their saved location instead of
  // being auto-redirected straight to the results page
  const forceEdit = searchParams.get("edit") === "true";


  // =========================================================
  // AUTH + SAVED LOCATION
  // =========================================================

  const user = useMemo(() => {

    try {
      return JSON.parse(
        localStorage.getItem("user")
      );
    } catch {
      return null;
    }

  }, []);

  const isLoggedIn = !!user;

  const savedLocation = useMemo(
    () => getStoredLocation(user?.id),
    [user]
  );

  const shouldAutoRedirect =
    isLoggedIn && !!savedLocation && !forceEdit;


  useEffect(() => {

    if (shouldAutoRedirect) {

      navigate("/crop-recommendation/results", {
        replace: true,
        state: savedLocation,
      });
    }

  }, [shouldAutoRedirect, navigate, savedLocation]);


  const [province, setProvince] = useState(
    savedLocation?.province || ""
  );

  const [district, setDistrict] = useState(
    savedLocation?.district || ""
  );


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


  function handleSubmit(event) {

    event.preventDefault();

    if (!province || !district) {
      return;
    }

    const location = { province, district };

    saveStoredLocation(user?.id, location);

    navigate("/crop-recommendation/results", {
      state: location,
    });
  }


  const canSubmit = province && district;


  // =========================================================
  // ALREADY REDIRECTING — render nothing to avoid a form flash
  // =========================================================

  if (shouldAutoRedirect) {
    return null;
  }


  // =========================================================
  // NOT LOGGED IN — ask the user to log in first
  // =========================================================

  if (!isLoggedIn) {

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
            {savedLocation
              ? "Update your saved location below."
              : "Tell us your province and district so we can tailor crop suggestions to your local soil and climate."}
          </p>

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


          {/* SUBMIT */}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!canSubmit}
          >
            Continue
            <span className={styles.arrow}>→</span>
          </button>

        </form>

      </div>

    </div>
  );
}