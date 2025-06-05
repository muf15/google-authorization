import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_Server_URL || "http://localhost:5000", 
});

export const googleAuth = async (code) => {
  return await api.post("/auth/google", { code });
};