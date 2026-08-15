import axiosClient from "./axiosClient";


// ===============================
// LOGIN
// ===============================

export const loginUser = async (email, password) => {

  const response = await axiosClient.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  return response.data;
};


// ===============================
// SIGNUP
// ===============================

export const signupUser = async (
  name,
  email,
  password
) => {

  const response = await axiosClient.post(
    "/auth/signup",
    {
      name,
      email,
      password,
    }
  );

  return response.data;
};


// ===============================
// CURRENT USER
// ===============================

export const getCurrentUser = async () => {

  const response = await axiosClient.get(
    "/auth/me"
  );

  return response.data;
};