import axios, { AxiosError, AxiosInstance } from "axios";
import { toast } from "sonner";
import { API_BASE_URL, AUTH_TOKEN_KEY } from "@/utils/constants";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    } else if (status && status >= 500) {
      toast.error("Server error", { description: message });
    }

    return Promise.reject(error);
  },
);

export default api;
