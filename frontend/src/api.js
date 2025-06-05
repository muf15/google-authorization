import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_Server_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const googleAuth = async (code) => {
  return await api.post("/auth/google", { code });
};