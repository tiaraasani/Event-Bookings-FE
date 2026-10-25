import { useAuth } from "@/stores/useAuth";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuth.getState().user?.accessToken;

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    const isLoggedIn = Boolean(useAuth.getState().user);

    const isTokenProblem =
      message === "Token expired" || message === "Invalid token";

    if (status === 401 && isTokenProblem && isLoggedIn) {
      useAuth.getState().logout();
    }

    return Promise.reject(error);
  },
);
