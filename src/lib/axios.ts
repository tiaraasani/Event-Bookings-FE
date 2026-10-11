import { useAuth } from "@/stores/useAuth";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuth.getState().user?.accessToken;

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error),
);