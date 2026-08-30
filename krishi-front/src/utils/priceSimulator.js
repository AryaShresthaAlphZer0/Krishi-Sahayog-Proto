// =========================================================
// Simulates a "live" market price feed for a product, since
// there's no real pricing backend yet. Generates an initial
// history via a random walk anchored to the product's
// basePrice, then produces one new tick at a time so a chart
// can appear to update in real time.
//
// This is clearly a simulation, not real market data — swap
// this out for a real price-history API call later without
// changing how the chart component consumes it.
// =========================================================

function randomStep(value, volatility) {

  const delta = (Math.random() - 0.5) * 2 * volatility;

  return Math.max(value * 0.4, value + delta);
}


export function generatePriceHistory(basePrice, points = 24) {

  const volatility = basePrice * 0.015;

  const history = [];

  let current = basePrice * (0.94 + Math.random() * 0.08);

  for (let i = 0; i < points; i++) {

    current = randomStep(current, volatility);

    history.push({
      time: i,
      price: Math.round(current),
    });
  }

  return history;
}


export function nextPricePoint(lastPoint, basePrice, nextTime) {

  const volatility = basePrice * 0.015;

  // Gently pull the walk back toward the base price so it
  // doesn't drift indefinitely over a long session.
  const pull = (basePrice - lastPoint.price) * 0.03;

  const nextPrice = Math.max(
    basePrice * 0.4,
    lastPoint.price + pull + (Math.random() - 0.5) * 2 * volatility
  );

  return {
    time: nextTime,
    price: Math.round(nextPrice),
  };
}


// A stable (non-live) pseudo-random % change per product, used
// for the small badge on product cards in the grid. Derived
// from the product id so it doesn't jump around on every
// re-render — only the detail view's chart actually "ticks".
export function getStableChangePercent(productId) {

  let hash = 0;

  for (let i = 0; i < productId.length; i++) {
    hash = (hash * 31 + productId.charCodeAt(i)) >>> 0;
  }

  // Map hash to a range of roughly -8% to +8%
  return ((hash % 1600) / 100) - 8;
}