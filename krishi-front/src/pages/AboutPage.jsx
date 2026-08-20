import Footer from "../components/Footer";
import styles from "./AboutPage.module.css";

const VALUES = [
  {
    icon: "🌱",
    title: "Farmer First",
    description:
      "Every feature starts with a real problem farmers face in the field, not a technology looking for a use case.",
  },
  {
    icon: "🔬",
    title: "Grounded in Data",
    description:
      "Our crop and disease models are trained on real agricultural data relevant to Nepal's soil and climate.",
  },
  {
    icon: "🤝",
    title: "Built to be Simple",
    description:
      "No jargon, no clutter — just plain language and clear answers a farmer can act on immediately.",
  },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className={styles.hero}>

        <span className={styles.badge}>
          Our Story
        </span>

        <h1 className={styles.title}>
          <span className={styles.titleGreen}>
            Built by students,
          </span>
          <span className={styles.titleAccent}>
            grown for farmers.
          </span>
        </h1>

        <p className={styles.subtitle}>
          Krishi Sahayog started as a simple question: what if
          every farmer in Nepal had a trusted advisor in their
          pocket? This is our answer.
        </p>

      </section>


      {/* =====================================================
          MISSION SECTION
      ===================================================== */}

      <section className={styles.section}>

        <div className={styles.sectionHead}>

          <span className={styles.sectionEyebrow}>
            OUR MISSION
          </span>

          <h2 className={styles.sectionTitle}>
            Making smart farming
            accessible to everyone.
          </h2>

          <p className={styles.sectionText}>
            Nepal's smallholder farmers rarely have easy access
            to agronomists or lab testing. We built Krishi
            Sahayog to close that gap — turning machine learning
            into practical, everyday guidance anyone can use,
            regardless of technical background.
          </p>

        </div>

      </section>


      {/* =====================================================
          VALUES SECTION
      ===================================================== */}

      <section className={styles.section}>

        <div className={styles.sectionHead}>
          <span className={styles.sectionEyebrow}>
            WHAT WE STAND FOR
          </span>

          <h2 className={styles.toolsTitle}>
            <span>Our</span>
            <em>core</em>
            <span>values.</span>
          </h2>
        </div>

        <div className={styles.grid}>

          {VALUES.map((value) => (

            <div
              key={value.title}
              className={styles.valueCard}
            >
              <span className={styles.valueIcon}>
                {value.icon}
              </span>

              <h3 className={styles.valueTitle}>
                {value.title}
              </h3>

              <p className={styles.valueText}>
                {value.description}
              </p>
            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

    </div>
  );
}