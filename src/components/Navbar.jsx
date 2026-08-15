import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

const LINKS = [
  { label: "Home", icon: "🏠", to: "/" },
  { label: "Features", icon: "✨", to: "/#features" },
  { label: "About", icon: "🌾", to: "/#about" },
  { label: "Login", icon: "🔑", to: "/login" },
];

export default function Navbar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();

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

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (item) => {
    if (item.label === "Home") {
      return location.pathname === "/" && !location.hash;
    }

    if (item.label === "Features") {
      return (
        location.pathname === "/" &&
        location.hash === "#features"
      );
    }

    if (item.label === "About") {
      return (
        location.pathname === "/" &&
        location.hash === "#about"
      );
    }

    if (item.label === "Login") {
      return location.pathname === "/login";
    }

    return false;
  };

  return (
    <>
      {/* Mobile hamburger */}
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

      {/* Mobile backdrop */}
      <div
        className={
          mobileOpen
            ? styles.backdropVisible
            : styles.backdrop
        }
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <nav
        className={[
          styles.sidebar,
          collapsed ? styles.collapsed : "",
          mobileOpen ? styles.open : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >

        {/* Brand */}
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

          {/* Collapse button */}
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

        {/* Navigation links */}
        <ul className={styles.links}>
          {LINKS.map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                className={[
                  styles.link,
                  isActive(item)
                    ? styles.active
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                title={item.label}
                onClick={() =>
                  setMobileOpen(false)
                }
              >
                <span className={styles.linkIcon}>
                  {item.icon}
                </span>

                <span className={styles.linkLabel}>
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Spacer */}
        <div className={styles.spacer} />

        <div className={styles.divider} />

        {/* CTA */}
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

        <p className={styles.footNote}>
          Built for Nepali farmers
        </p>
      </nav>
    </>
  );
}