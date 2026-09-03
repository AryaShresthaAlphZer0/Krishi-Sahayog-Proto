import DISEASE_CATALOG from "../data/diseaseCatalog";


// =========================================================
// Simulates an "analysis" delay + a randomly picked result.
// This is clearly a stand-in for a real image-classification
// model — swap this out for an API call once one exists,
// without changing how the page consumes the result.
// =========================================================

const HEALTHY_CHANCE = 0.2;
const ANALYSIS_DELAY_MS = 1800;


function randomBetween(min, max) {
  return Math.round(min + Math.random() * (max - min));
}


export function simulateDiagnosis() {

  return new Promise((resolve) => {

    window.setTimeout(() => {

      const healthy = Math.random() < HEALTHY_CHANCE;

      const diseaseOnly = DISEASE_CATALOG.filter((d) => d.id !== "healthy");
      const healthyEntry = DISEASE_CATALOG.find((d) => d.id === "healthy");

      const picked = healthy
        ? healthyEntry
        : diseaseOnly[Math.floor(Math.random() * diseaseOnly.length)];

      const confidence = randomBetween(
        picked.confidenceRange[0],
        picked.confidenceRange[1]
      );

      resolve({ ...picked, confidence });

    }, ANALYSIS_DELAY_MS);
  });
}