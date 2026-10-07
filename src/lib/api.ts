import axios from "axios";
import { useAuth } from "@/stores/useAuth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
});

api.interceptors.request.use((config) => {
  const token = useAuth.getState().user?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
