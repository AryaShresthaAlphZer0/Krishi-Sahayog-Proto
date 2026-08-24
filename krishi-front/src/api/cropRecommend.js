import axiosClient from "./axiosClient";

// =========================================================
// POST /api/crop-recommend
// body: { N, P, K, ph, temperature, humidity, rainfall,
//         province?, district? }
// =========================================================

export const predictCrop = async (payload) => {

  const response = await axiosClient.post("/crop-recommend", payload);

  return response.data;
};


// =========================================================
// GET /api/crop-recommend
// Returns the user's latest saved recommendation, or null.
// =========================================================

export const getLatestRecommendation = async () => {

  const response = await axiosClient.get("/crop-recommend");

  return response.data;
};


// =========================================================
// GET /api/crop-recommend/info  (public, no auth required)
// =========================================================

export const getModelInfo = async () => {

  const response = await axiosClient.get("/crop-recommend/info");

  return response.data;
};