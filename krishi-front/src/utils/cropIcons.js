// =========================================================
// Decorative icon per crop — purely cosmetic, falls back to
// a generic sprout for anything not listed.
// =========================================================

const CROP_ICONS = {
  rice: "🌾",
  maize: "🌽",
  wheat: "🍞",
  millet: "🌾",
  chickpea: "🫘",
  kidneybeans: "🫘",
  pigeonpeas: "🫘",
  mungbean: "🫘",
  blackgram: "🫘",
  lentil: "🫘",
  pomegranate: "🍇",
  banana: "🍌",
  mango: "🥭",
  watermelon: "🍉",
  muskmelon: "🍈",
  apple: "🍎",
  orange: "🍊",
  papaya: "🥭",
  potato: "🥔",
  mustard: "🌻",
  jute: "🌿",
  coffee: "☕",
};


export function getCropIcon(crop) {

  return CROP_ICONS[crop?.toLowerCase()] || "🌱";
}


export function formatCropName(crop) {

  if (!crop) {
    return "";
  }

  return crop.charAt(0).toUpperCase() + crop.slice(1);
}