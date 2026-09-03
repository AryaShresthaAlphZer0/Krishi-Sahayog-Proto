import { useEffect, useState } from "react";

import LeafImageUpload from "../components/LeafImageUpload";
import { simulateDiagnosis } from "../utils/diseaseSimulator";
import { useToast } from "../context/useToast";

import styles from "./DiseaseDetectionPage.module.css";


export default function DiseaseDetectionPage() {

  const { showToast } = useToast();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);


  // Build/revoke a preview URL whenever the selected file changes
  useEffect(() => {

    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);

  }, [file]);


  function handleFileSelected(newFile) {

    setFile(newFile);
    setResult(null);
  }


  function handleUploadError(message) {

    showToast(message, "error");
  }


  function handleReset() {

    setFile(null);
    setResult(null);
    setAnalyzing(false);
  }


  async function handleAnalyze() {

    if (!file || analyzing) {
      return;
    }

    setAnalyzing(true);
    setResult(null);

    const diagnosis = await simulateDiagnosis();

    setResult(diagnosis);
    setAnalyzing(false);
  }


  function handleSaveToHistory() {

    showToast(
      "Saving to history isn't connected yet — coming soon!",
      "info"
    );
  }


  return (
    <div className={styles.page}>

      <div className={styles.blobOne} />
      <div className={styles.blobTwo} />

      <div className={styles.wrapper}>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className={styles.header}>

          <span className={styles.eyebrowBadge}>
            🔬 AI Crop Health · Preview
          </span>

          <h1 className={styles.title}>
            Catch plant disease <em>before it spreads</em>
          </h1>

          <p className={styles.subtitle}>
            Upload a photo of an affected leaf and get a diagnosis with
            treatment steps. This preview simulates a diagnosis — real
            image-based detection is the next step once a trained model
            is connected.
          </p>

        </div>


        {/* =====================================================
            UPLOAD + DIAGNOSIS
        ===================================================== */}

        <div className={styles.grid}>

          {/* ---- UPLOAD CARD ---- */}

          <div className={styles.card}>

            <LeafImageUpload
              previewUrl={previewUrl}
              onFileSelected={handleFileSelected}
              onError={handleUploadError}
            />

            <div className={styles.uploadActions}>

              <button
                type="button"
                className={styles.analyzeBtn}
                onClick={handleAnalyze}
                disabled={!file || analyzing}
              >
                {analyzing ? "Analyzing…" : "🔍 Analyze leaf"}
              </button>

              <button
                type="button"
                className={styles.resetBtn}
                onClick={handleReset}
              >
                Reset
              </button>

            </div>

          </div>


          {/* ---- DIAGNOSIS CARD ---- */}

          <div className={styles.card}>

            <div className={styles.labelRow}>
              <span className={styles.labelIcon}>✓</span>
              <span className={styles.label}>Diagnosis result</span>
            </div>

            {!file && !result && (

              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>🌿</span>
                <p>Upload a leaf photo to see a diagnosis here.</p>
              </div>
            )}

            {file && !result && !analyzing && (

              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>👉</span>
                <p>Ready when you are — click "Analyze leaf".</p>
              </div>
            )}

            {analyzing && (

              <div className={styles.loadingState}>
                <span className={styles.spinner} />
                <p>Analyzing your leaf…</p>
              </div>
            )}

            {result && !analyzing && (

              <div className={styles.resultBlock}>

                <div className={styles.diseaseRow}>

                  <div
                    className={[
                      styles.diseaseIconWrap,
                      result.id === "healthy" ? styles.healthyIconWrap : "",
                    ].join(" ")}
                  >
                    <span className={styles.diseaseIcon}>
                      {result.icon}
                    </span>
                  </div>

                  <div>

                    <span className={styles.detectedLabel}>
                      {result.id === "healthy" ? "Result" : "Detected disease"}
                    </span>

                    <span className={styles.diseaseName}>
                      {result.name}
                      {result.scientificName && (
                        <span className={styles.scientificName}>
                          {" "}({result.scientificName})
                        </span>
                      )}
                    </span>

                    <span className={styles.confidenceBadge}>
                      ✓ {result.confidence}% confidence
                    </span>

                  </div>

                </div>

                <div className={styles.miniStats}>

                  <div className={styles.miniStat}>

                    <span className={styles.miniStatLabel}>
                      Severity
                    </span>

                    <span className={styles.miniStatValue}>
                      {result.severity}
                    </span>

                    <div className={styles.severityTrack}>
                      <div
                        className={[
                          styles.severityFill,
                          styles[
                            "severity" +
                              result.severity.charAt(0).toUpperCase() +
                              result.severity.slice(1)
                          ],
                        ].join(" ")}
                      />
                    </div>

                  </div>

                  <div className={styles.miniStat}>

                    <span className={styles.miniStatLabel}>
                      Next step
                    </span>

                    <p className={styles.remedyText}>
                      {result.remedy}
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  className={styles.saveBtn}
                  onClick={handleSaveToHistory}
                >
                  Save result to history
                </button>

              </div>
            )}

          </div>

        </div>


        {/* =====================================================
            FEATURE HIGHLIGHTS
        ===================================================== */}

        <div className={styles.featureRow}>

          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>📸</span>
            <h3>Snap or upload</h3>
            <p>
              Take a photo in the field or upload one from your
              gallery — JPG, PNG, or WEBP.
            </p>
          </div>

          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🔍</span>
            <h3>Clear diagnosis</h3>
            <p>
              See the likely disease, how severe it looks, and what
              to do next — no jargon.
            </p>
          </div>

          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🧠</span>
            <h3>Built for real detection</h3>
            <p>
              This preview simulates a diagnosis. Swapping in a
              trained image model is the next step.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}