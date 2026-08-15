import Button from "../components/Button";
import Card from "../components/Card";
import Footer from "../components/Footer";
import PlantAnimation from "../components/PlantAnimation";
import styles from "./LandingPage.module.css";

const FEATURES = [
  {
    icon: "🌾",
    title: "Crop Recommendation",
    description:
      "Enter soil nutrients, pH and local weather to get the crop best suited to your field.",
  },
  {
    icon: "🍃",
    title: "Disease Detection",
    description:
      "Upload a photo of a leaf and our model identifies the disease with treatment guidance.",
  },
  {
    icon: "📊",
    title: "Farm Dashboard",
    description:
      "Track every recommendation and scan in one place, so you can plan the next season.",
  },
];

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span className={styles.badge}>AI FOR NEPALI AGRICULTURE</span>
          <h1 className={styles.title}>
            Grow smarter with <span className={styles.titleAccent}>Krishi Sahayog</span>
          </h1>
          <p className={styles.subtitle}>
            An AI companion for farmers in Nepal — get the right crop for your soil and catch plant
            disease early, straight from your phone.
          </p>
          <div className={styles.actions}>
            <Button to="/signup" variant="accent">
              Get Started
            </Button>
            <Button to="/login" variant="outline">
              Login
            </Button>
          </div>
          <div className={styles.stats}>
            <div>
              <p className={styles.statValue}>22+</p>
              <p className={styles.statLabel}>Crops covered</p>
            </div>
            <div>
              <p className={styles.statValue}>30+</p>
              <p className={styles.statLabel}>Leaf diseases</p>
            </div>
            <div>
              <p className={styles.statValue}>&lt;5s</p>
              <p className={styles.statLabel}>Average result time</p>
            </div>
          </div>
        </div>
        <PlantAnimation />
      </section>

      <section id="features" className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Everything a small farm needs</h2>
          <p className={styles.sectionText}>
            Three simple tools, built around the decisions farmers actually make each season.
          </p>
        </div>
        <div className={styles.grid}>
          {FEATURES.map((f) => (
            <Card key={f.title} icon={f.icon} title={f.title} description={f.description} />
          ))}
        </div>
      </section>

      <section id="about" className={`${styles.section} ${styles.about}`}>
        <div className={styles.aboutInner}>
          <div>
            <h2 className={styles.sectionTitle}>About the project</h2>
            <p className={styles.sectionText}>
              Krishi Sahayog is a student-built platform that puts machine learning within reach of
              smallholder farmers in Nepal. It pairs a React interface with a Flask service running
              crop-suitability and leaf-disease models, in Nepali-friendly plain language.
            </p>
          </div>
          <ul className={styles.stepList}>
            <li className={styles.step}>
              <span className={styles.stepNum}>1</span>
              <p className={styles.stepText}>
                <strong>Create an account</strong> and add your farm's basic details.
              </p>
            </li>
            <li className={styles.step}>
              <span className={styles.stepNum}>2</span>
              <p className={styles.stepText}>
                <strong>Enter soil data</strong> or upload a leaf photo from the field.
              </p>
            </li>
            <li className={styles.step}>
              <span className={styles.stepNum}>3</span>
              <p className={styles.stepText}>
                <strong>Act on the result</strong> — a crop suggestion or a treatment plan, saved to
                your dashboard.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.banner}>
        <h2 className={styles.bannerTitle}>Ready to plan your next harvest?</h2>
        <p className={styles.bannerText}>
          Join Krishi Sahayog and let AI handle the guesswork, so you can focus on the field.
        </p>
        <Button to="/signup" variant="accent">
          Create your account
        </Button>
      </section>

      <Footer />
    </div>
  );
}
