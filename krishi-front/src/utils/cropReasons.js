// =========================================================
// Generates the "why this crop" bullets by checking the
// user's actual soil inputs against that crop's real observed
// range in the training data (see data/cropFacts.js).
// =========================================================

function inRange(value, [min, max], tolerance = 0) {
  return value >= min - tolerance && value <= max + tolerance;
}


export function getMatchReasons(inputs, facts, maxReasons = 3) {

  if (!facts) {
    return [];
  }

  const { nitrogen, phosphorus, potassium, ph } = inputs;

  const reasons = [];

  if (inRange(ph, facts.phRange)) {
    reasons.push("pH sits right in this crop's typical range");
  }

  if (inRange(nitrogen, facts.nRange, 10)) {
    reasons.push("nitrogen level is a good match");
  }

  if (inRange(phosphorus, facts.pRange, 10)) {
    reasons.push("phosphorus level suits this crop well");
  }

  if (inRange(potassium, facts.kRange, 10)) {
    reasons.push("potassium level suits this crop well");
  }

  if (reasons.length === 0) {
    reasons.push("closest overall match among the crops the model knows");
  }

  return reasons.slice(0, maxReasons);
}