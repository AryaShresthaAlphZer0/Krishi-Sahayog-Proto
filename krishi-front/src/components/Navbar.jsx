import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import Profile from "./Profile";

export default function Navbar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  const location = useLocation();

  /* =========================================
     SIDEBAR WIDTH
  ========================================= */

  useEffect(() => {
    const isMobile = window.matchMedia(
      "(max-width: 767px)"
    ).matches;

    document.documentElement.style.setProperty(
      "--sidebar-w",
      isMobile
        ? "0px"
        : collapsed
        ? "74px"
        : "250px"
    );
  }, [collapsed]);

  /* =========================================
     CLOSE MOBILE MENU WHEN ROUTE CHANGES
  ========================================= */

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* =========================================
     FEATURE ACTIVE STATE
  ========================================= */

  const isFeatureActive =
    location.pathname === "/crop-recommendation" ||
    location.pathname === "/disease-detection" ||
    location.pathname === "/dashboard";

  return (
    <>
      {/* =========================================
          MOBILE HAMBURGER
      ========================================= */}

      <button
        type="button"
        className={styles.hamburger}
        aria-label="Toggle navigation"
        onClick={() =>
          setMobileOpen((value) => !value)
        }
      >
        {mobileOpen ? "✕" : "☰"}
      </button>


      {/* =========================================
          MOBILE BACKDROP
      ========================================= */}

      <div
        className={
          mobileOpen
            ? styles.backdropVisible
            : styles.backdrop
        }
        onClick={() => setMobileOpen(false)}
      />


      {/* =========================================
          SIDEBAR
      ========================================= */}

      <nav
        className={[
          styles.sidebar,
          collapsed ? styles.collapsed : "",
          mobileOpen ? styles.open : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >

        {/* =========================================
            BRAND
        ========================================= */}

        <div className={styles.brandRow}>

          <Link
            to="/"
            className={styles.brand}
          >
            <span className={styles.leafMark}>
              🌱
            </span>

            <span className={styles.brandText}>
              Krishi Sahayog
            </span>
          </Link>


          <button
            type="button"
            className={styles.collapseBtn}
            aria-label={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            onClick={() =>
              setCollapsed((value) => !value)
            }
          >
            {collapsed ? "»" : "«"}
          </button>

        </div>


        {/* =========================================
            NAVIGATION
        ========================================= */}

        <ul className={styles.links}>

          {/* HOME */}

          <li>
            <Link
              to="/"
              className={[
                styles.link,
                location.pathname === "/" &&
                !location.hash
                  ? styles.active
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              title="Home"
              onClick={() =>
                setMobileOpen(false)
              }
            >
              <span className={styles.linkIcon}>
                🏠
              </span>

              <span className={styles.linkLabel}>
                Home
              </span>
            </Link>
          </li>


          {/* =========================================
              FEATURES
          ========================================= */}

          <li
            className={styles.featureMenu}
            onMouseEnter={() => {
              if (!collapsed) {
                setFeaturesOpen(true);
              }
            }}
            onMouseLeave={() => {
              if (!collapsed) {
                setFeaturesOpen(false);
              }
            }}
          >

            <button
              type="button"
              className={[
                styles.link,
                styles.featureButton,
                isFeatureActive
                  ? styles.active
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              title="Features"
              onClick={() =>
                setFeaturesOpen(
                  (value) => !value
                )
              }
            >

              <span className={styles.linkIcon}>
                ✨
              </span>

              <span className={styles.linkLabel}>
                Features
              </span>

              {!collapsed && (
                <span
                  className={[
                    styles.featureArrow,
                    featuresOpen
                      ? styles.arrowOpen
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  ›
                </span>
              )}

            </button>


            {/* FEATURE DROPDOWN */}

            {!collapsed && featuresOpen && (

              <div className={styles.featureDropdown}>

                <Link
                  to="/crop-recommendation"
                  className={styles.featureItem}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                >
                  <span>🌾</span>

                  <span>
                    Crop Recommendation
                  </span>
                </Link>


                <Link
                  to="/disease-detection"
                  className={styles.featureItem}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                >
                  <span>🍃</span>

                  <span>
                    Disease Detection
                  </span>
                </Link>


                <Link
                  to="/dashboard"
                  className={styles.featureItem}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                >
                  <span>📊</span>

                  <span>
                    Farm Dashboard
                  </span>
                </Link>

              </div>

            )}

          </li>


          {/* =========================================
              ABOUT
          ========================================= */}

          <li>
            <Link
              to="/#about"
              className={[
                styles.link,
                location.pathname === "/" &&
                location.hash === "#about"
                  ? styles.active
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              title="About"
              onClick={() =>
                setMobileOpen(false)
              }
            >
              <span className={styles.linkIcon}>
                🌿
              </span>

              <span className={styles.linkLabel}>
                About
              </span>
            </Link>
          </li>

        </ul>


        {/* =========================================
            EMPTY SPACE
        ========================================= */}

        <div className={styles.spacer} />


        {/* =========================================
            PROFILE
        ========================================= */}

        <div className={styles.profileSection}>
          <Profile collapsed={collapsed} />
        </div>


        {/* =========================================
            DIVIDER
        ========================================= */}

        <div className={styles.divider} />


        {/* =========================================
            CTA
        ========================================= */}

        <Link
          to="/signup"
          className={styles.cta}
          title="Get Started"
          onClick={() =>
            setMobileOpen(false)
          }
        >
          <span>🚀</span>

          <span className={styles.ctaLabel}>
            Get Started
          </span>
        </Link>


        {/* =========================================
            FOOTNOTE
        ========================================= */}

        <p className={styles.footNote}>
          Built for Nepali farmers
        </p>

      </nav>
    </>
  );
}