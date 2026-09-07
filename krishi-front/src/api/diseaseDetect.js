import axiosClient from "./axiosClient";

// =========================================================
// POST /api/disease-detect
// multipart/form-data with an "image" field
// =========================================================

export const detectDisease = async (file) => {

  const formData = new FormData();
  formData.append("image", file);

  const response = await axiosClient.post("/disease-detect", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};