import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_Server_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track if we're currently refreshing the token
let isRefreshing = false;
let failedRequests = [];

// Handle token refresh
const processQueuedRequests = (error) => {
  failedRequests.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedRequests = [];
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request has already been retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If token expired error
    if (error.response?.data?.code === "TOKEN_EXPIRED") {
      originalRequest._retry = true;

      // If already refreshing, queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequests.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Attempt to refresh token
        await api.post("/auth/refresh-token");
        processQueuedRequests(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueuedRequests(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const googleAuth = async (code) => {
  return await api.post("/auth/login", { code });
};
