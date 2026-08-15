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

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className={styles.hero}>

        {/* LEFT SIDE */}
        <div className={styles.heroContent}>

          {/* Small heading */}
          <span className={styles.badge}>
            Practical intelligence for Nepal's fields
          </span>


          {/* Main heading */}
          <h1 className={styles.title}>
            <span className={styles.titleGreen}>
              Every season
            </span>

            <span className={styles.titleAccent}>
              starts with a
            </span>

            <span className={styles.titleGreen}>
              better question.
            </span>
          </h1>


          {/* Description */}
          <p className={styles.subtitle}>
            Krishi Sahayog brings a little more certainty to the
            field — recommending what to grow, spotting what's
            wrong, and helping every decision land well.
          </p>


          {/* Buttons */}
          <div className={styles.actions}>

            <Button
              to="/signup"
              variant="accent"
            >
              Get Started
            </Button>

            <Button
              to="/login"
              variant="outline"
            >
              Login
            </Button>

          </div>


          {/* Statistics */}
          <div className={styles.stats}>

            <div className={styles.stat}>
              <p className={styles.statValue}>
                22+
              </p>

              <p className={styles.statLabel}>
                Crops covered
              </p>
            </div>


            <div className={styles.stat}>
              <p className={styles.statValue}>
                30+
              </p>

              <p className={styles.statLabel}>
                Leaf diseases
              </p>
            </div>


            <div className={styles.stat}>
              <p className={styles.statValue}>
                &lt;5s
              </p>

              <p className={styles.statLabel}>
                Average result time
              </p>
            </div>

          </div>

        </div>


        {/* RIGHT SIDE - PLANT ANIMATION */}

        <div className={styles.plantContainer}>
          <PlantAnimation />
        </div>

      </section>


      {/* =====================================================
          FEATURES SECTION
      ===================================================== */}

      <section
        id="features"
        className={styles.section}
      >

        <div className={styles.sectionHead}>

          <span className={styles.sectionEyebrow}>
  WHAT WE BRING TO THE FIELD
        </span>

        <h2 className={styles.toolsTitle}>
        <span>Three tools.</span>
         <em>One calmer</em>
        <span>season.</span>
        </h2>

          <p className={styles.sectionText}>
            Three simple tools, built around the decisions
            farmers actually make each season.
          </p>

        </div>


        <div className={styles.grid}>

          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}

        </div>

      </section>


      {/* =====================================================
          ABOUT SECTION
      ===================================================== */}

      <section
        id="about"
        className={`${styles.section} ${styles.about}`}
      >

        <div className={styles.aboutInner}>

          <div className={styles.aboutContent}>

            <span className={styles.sectionEyebrow}>
              ABOUT KRISHI SAHAYOG
            </span>

            <h2 className={styles.sectionTitle}>
              Technology that understands
              the field.
            </h2>

            <p className={styles.sectionText}>
              Krishi Sahayog is a student-built platform that
              puts machine learning within reach of
              smallholder farmers in Nepal.
            </p>

            <p className={styles.sectionText}>
              It pairs a React interface with a Flask service
              running crop-suitability and leaf-disease models,
              using Nepali-friendly plain language.
            </p>

          </div>


          {/* Steps */}

          <ul className={styles.stepList}>

            <li className={styles.step}>

              <span className={styles.stepNum}>
                1
              </span>

              <p className={styles.stepText}>
                <strong>
                  Create an account
                </strong>

                <span>
                  Add your farm's basic details.
                </span>
              </p>

            </li>


            <li className={styles.step}>

              <span className={styles.stepNum}>
                2
              </span>

              <p className={styles.stepText}>
                <strong>
                  Enter your data
                </strong>

                <span>
                  Enter soil information or upload
                  a leaf photo.
                </span>
              </p>

            </li>


            <li className={styles.step}>

              <span className={styles.stepNum}>
                3
              </span>

              <p className={styles.stepText}>
                <strong>
                  Act on the result
                </strong>

                <span>
                  Get a crop suggestion or treatment
                  guidance.
                </span>
              </p>

            </li>

          </ul>

        </div>

      </section>


      {/* =====================================================
          CTA BANNER
      ===================================================== */}

      <section className={styles.banner}>

        <div className={styles.bannerContent}>

          <span className={styles.sectionEyebrow}>
            YOUR NEXT HARVEST
          </span>

          <h2 className={styles.bannerTitle}>
            Ready to ask a better
            question?
          </h2>

          <p className={styles.bannerText}>
            Join Krishi Sahayog and let AI handle the
            guesswork, so you can focus on the field.
          </p>

          <Button
            to="/signup"
            variant="accent"
          >
            Create your account
          </Button>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

    </div>
  );
}