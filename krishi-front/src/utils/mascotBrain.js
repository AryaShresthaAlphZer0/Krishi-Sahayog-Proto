import CROP_FACTS from "../data/cropFacts";
import { formatCropName } from "./cropIcons";


// =========================================================
// Simple keyword-matched responses — free, no API, no cost.
// Crop-specific answers are generated from cropFacts.js so
// they stay in sync with the real 22-crop model instead of
// duplicating content.
// =========================================================

const INTENTS = [
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "namaste"],
    reply:
      "Namaste! 👋 I'm Pip. Ask me about a crop like rice or potato, " +
      "or about pests, fertilizer, irrigation, or how Krishi Sahayog works!",
  },
  {
    id: "about",
    keywords: [
      "what is krishi sahayog",
      "what do you do",
      "what can you do",
      "about this app",
    ],
    reply:
      "Krishi Sahayog helps Nepali farmers get weather-aware crop " +
      "recommendations based on soil (N, P, K, pH) and live weather. " +
      "There's also a Bazaar for seeds, equipment, and crop medicine! 🌾",
  },
  {
    id: "crop_recommendation_howto",
    keywords: [
      "how does crop recommendation work",
      "recommend a crop",
      "crop recommendation",
      "which crop should i grow",
    ],
    reply:
      "Head to Crop Recommendation from the sidebar, save your province " +
      "and district, then enter your soil's N, P, K, and pH. I combine " +
      "that with this week's weather to suggest the best-matching crop " +
      "— real numbers from a trained model, not guesses. 🌱",
  },
  {
    id: "disease_detection",
    keywords: ["disease", "leaf disease", "sick plant", "pest identification"],
    reply:
      "Leaf disease detection is planned but not live yet — hang tight! 🍃 " +
      "For now I can help with crop advice, pests, and fertilizer questions.",
  },
  {
    id: "marketplace",
    keywords: ["marketplace", "bazaar", "buy seed", "sell", "equipment", "where to buy"],
    reply:
      "Check out the Bazaar from the sidebar — browse seeds, equipment, " +
      "and crop medicine, add them to your cart, or list your own " +
      "products to sell. 🛍️",
  },
  {
    id: "pest",
    keywords: ["pest", "insect", "bug", "infestation"],
    reply:
      "For pests: rotate crops, monitor regularly, and try neem oil or a " +
      "bio-pesticide before reaching for stronger chemicals — gentler on " +
      "soil health long-term. 🐛",
  },
  {
    id: "fertilizer",
    keywords: ["fertilizer", "npk", "nutrient", "urea", "dap", "potash"],
    reply:
      "Nitrogen (urea) drives leafy growth, phosphorus (DAP) supports " +
      "roots and flowering, and potassium (potash) improves fruit and " +
      "tuber quality. A soil test tells you which one your field " +
      "actually needs. 🧪",
  },
  {
    id: "irrigation",
    keywords: ["irrigation", "watering", "how much water"],
    reply:
      "Most crops do best with consistent moisture rather than heavy, " +
      "infrequent watering. Early morning irrigation also cuts down on " +
      "evaporation loss. 💧",
  },
  {
    id: "soil",
    keywords: ["soil health", "soil test", "ph level", "acidic soil"],
    reply:
      "Most crops prefer a pH between 6 and 7. If a soil test comes back " +
      "far outside that, lime raises pH and organic matter or sulfur " +
      "lowers it, over a season or two. 🌍",
  },
];


const FALLBACK =
  "I'm not sure about that one — try asking me about a crop like rice " +
  "or potato, or about pests, fertilizer, irrigation, or how Krishi " +
  "Sahayog works! 🌱";


function normalize(text) {
  return text.toLowerCase().trim();
}


export function getMascotReply(message) {

  const text = normalize(message);

  if (!text) {
    return FALLBACK;
  }

  // Crop-specific answer, generated from real cropFacts data
  for (const cropKey of Object.keys(CROP_FACTS)) {

    if (text.includes(cropKey)) {

      const facts = CROP_FACTS[cropKey];

      return (
        `${formatCropName(cropKey)} 🌾 is a ${facts.category.toLowerCase()}, ` +
        `usually ready in ${facts.duration}. ${facts.tip}`
      );
    }
  }

  for (const intent of INTENTS) {

    if (intent.keywords.some((keyword) => text.includes(keyword))) {
      return intent.reply;
    }
  }

  return FALLBACK;
}