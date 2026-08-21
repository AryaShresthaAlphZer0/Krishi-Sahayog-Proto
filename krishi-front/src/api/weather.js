import axiosClient from "./axiosClient";

// =========================================================
// GET /api/weather?province=X&district=Y
// Returns { success, location, current, days[] }
// =========================================================

export const getWeather = async (province, district) => {

  const response = await axiosClient.get("/weather", {
    params: { province, district },
  });

  return response.data;
};