// =========================================================
// DISEASE CATALOG (mock)
//
// This powers a SIMULATED diagnosis — there's no trained image
// model behind this yet (that's a different kind of ML problem
// than the tabular crop recommender). Content is general
// agronomic reference, written in-house, not sourced from any
// specific dataset — a real model's output classes/remedies
// should replace this once one exists.
// =========================================================

const DISEASE_CATALOG = [

  {
    id: "rice-blast",
    name: "Rice Blast",
    scientificName: "Magnaporthe oryzae",
    crop: "Rice",
    icon: "🌾",
    severity: "Severe",
    confidenceRange: [80, 96],
    remedy:
      "Remove and destroy infected leaves, avoid excess nitrogen, and apply " +
      "a tricyclazole-based fungicide at early signs of lesions.",
  },
  {
    id: "bacterial-leaf-blight",
    name: "Bacterial Leaf Blight",
    scientificName: "Xanthomonas oryzae",
    crop: "Rice",
    icon: "🌾",
    severity: "Moderate",
    confidenceRange: [72, 92],
    remedy:
      "Improve field drainage, avoid overhead irrigation, and use a " +
      "copper-based bactericide if the disease is spreading.",
  },
  {
    id: "wheat-rust",
    name: "Wheat Leaf Rust",
    scientificName: "Puccinia triticina",
    crop: "Wheat",
    icon: "🍞",
    severity: "Moderate",
    confidenceRange: [75, 93],
    remedy:
      "Apply a triazole fungicide at the first sign of orange pustules, " +
      "and rotate with a non-cereal crop next season to break the cycle.",
  },
  {
    id: "late-blight",
    name: "Late Blight",
    scientificName: "Phytophthora infestans",
    crop: "Potato / Tomato",
    icon: "🥔",
    severity: "Severe",
    confidenceRange: [82, 97],
    remedy:
      "Remove infected foliage immediately, avoid overhead watering, and " +
      "apply a copper-based fungicide before wet weather sets in.",
  },
  {
    id: "early-blight",
    name: "Early Blight",
    scientificName: "Alternaria solani",
    crop: "Potato / Tomato",
    icon: "🍅",
    severity: "Mild",
    confidenceRange: [70, 90],
    remedy:
      "Remove infected lower leaves, avoid overhead watering, and apply " +
      "a copper-based fungicide every 7–10 days.",
  },
  {
    id: "powdery-mildew",
    name: "Powdery Mildew",
    scientificName: "Erysiphe cichoracearum",
    crop: "Vegetables",
    icon: "🥦",
    severity: "Mild",
    confidenceRange: [68, 88],
    remedy:
      "Improve air circulation between plants, avoid wetting leaves when " +
      "watering, and apply a sulfur-based fungicide or neem oil.",
  },
  {
    id: "leaf-spot",
    name: "Cercospora Leaf Spot",
    scientificName: "Cercospora spp.",
    crop: "General",
    icon: "🌿",
    severity: "Mild",
    confidenceRange: [65, 85],
    remedy:
      "Remove and destroy affected leaves, avoid working in wet fields, " +
      "and rotate crops to reduce spore build-up in the soil.",
  },
  {
    id: "healthy",
    name: "No Disease Detected",
    scientificName: null,
    crop: null,
    icon: "✅",
    severity: "Healthy",
    confidenceRange: [88, 99],
    remedy:
      "This leaf looks healthy. Keep monitoring regularly, especially " +
      "after heavy rain or during humid weather when disease spreads fastest.",
  },
];

export default DISEASE_CATALOG;