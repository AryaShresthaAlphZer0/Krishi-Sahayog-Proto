import { useTheme } from "../context/useTheme";

import styles from "./SettingsPage.module.css";


export default function SettingsPage() {

  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.page}>

      <div className={styles.wrapper}>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className={styles.header}>

          <span className={styles.eyebrow}>
            Settings
          </span>

          <h1 className={styles.title}>
            Appearance
          </h1>

          <p className={styles.subtitle}>
            Choose how Krishi Sahayog looks on this device.
          </p>

        </div>


        {/* =====================================================
            THEME CARD
        ===================================================== */}

        <div className={styles.card}>

          <h2 className={styles.sectionTitle}>
            Theme
          </h2>

          <div className={styles.themeGrid}>

            {/* LIGHT */}

            <button
              type="button"
              className={[
                styles.themeOption,
                theme === "light" ? styles.themeOptionActive : "",
              ].join(" ")}
              onClick={() => setTheme("light")}
            >

              {theme === "light" && (
                <span className={styles.checkMark}>
                  ✓
                </span>
              )}

              <div className={styles.previewLight}>
                <span className={styles.previewDot} />
                <span className={styles.previewLine} />
                <span className={styles.previewLineShort} />
              </div>

              <span className={styles.themeLabel}>
                ☀️ Light
              </span>

            </button>


            {/* DARK */}

            <button
              type="button"
              className={[
                styles.themeOption,
                theme === "dark" ? styles.themeOptionActive : "",
              ].join(" ")}
              onClick={() => setTheme("dark")}
            >

              {theme === "dark" && (
                <span className={styles.checkMark}>
                  ✓
                </span>
              )}

              <div className={styles.previewDark}>
                <span className={styles.previewDot} />
                <span className={styles.previewLine} />
                <span className={styles.previewLineShort} />
              </div>

              <span className={styles.themeLabel}>
                🌙 Dark
              </span>

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}