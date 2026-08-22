import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000/api";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// A plain client with no interceptors, used only for the token
// refresh call itself so a failed refresh can't recursively
// trigger another refresh attempt.
const refreshClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// =========================================================
// ATTACH THE ACCESS TOKEN TO EVERY OUTGOING REQUEST
// =========================================================

axiosClient.interceptors.request.use((config) => {

  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// =========================================================
// ON A 401, TRY ONE SILENT TOKEN REFRESH BEFORE GIVING UP
// =========================================================

function clearSession() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}


// Only one refresh call in flight at a time, even if several
// requests 401 at the same moment.
let refreshPromise = null;


async function refreshAccessToken() {

  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await refreshClient.post(
    "/auth/refresh",
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  const newAccessToken = response.data?.access_token;

  if (!newAccessToken) {
    throw new Error("Refresh response was missing an access token");
  }

  localStorage.setItem("access_token", newAccessToken);

  return newAccessToken;
}


axiosClient.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;
    const status = error.response?.status;

    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/signup") ||
      originalRequest?.url?.includes("/auth/refresh");

    const shouldAttemptRefresh =
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint;

    if (!shouldAttemptRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return axiosClient(originalRequest);

    } catch (refreshError) {

      clearSession();

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    }
  }
);


export default axiosClient;