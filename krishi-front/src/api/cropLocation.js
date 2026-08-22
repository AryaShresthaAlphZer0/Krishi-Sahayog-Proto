import axiosClient from "./axiosClient";

// =========================================================
// The backend identifies the user from the JWT in the
// Authorization header (attached automatically by
// axiosClient) — no user id is ever sent from the client.
// =========================================================

export const getCropLocation = async () => {

  const response = await axiosClient.get("/crop-location");

  return response.data;
};


export const saveCropLocation = async (province, district) => {

  const response = await axiosClient.put("/crop-location", {
    province,
    district,
  });

  return response.data;
};