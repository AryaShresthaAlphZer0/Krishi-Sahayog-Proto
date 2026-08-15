import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <p className={styles.brand}>🌱 Krishi Sahayog</p>
          <p className={styles.tagline}>AI crop recommendation & plant disease detection for Nepal.</p>
        </div>
        <p className={styles.copyright}>© {new Date().getFullYear()} Krishi Sahayog. College project.</p>
      </div>
    </footer>
  );
}
