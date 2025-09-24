// lasop-client/src/lib/api.ts
import axios, { AxiosHeaders } from "axios";
import { getTokenFromStorage } from "@/utils/token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const already =
    (config.headers as any)?.Authorization ||
    (config.headers as any)?.authorization;

  if (!already) {
    const token = getTokenFromStorage();
    if (token) {
      const headers =
        config.headers instanceof AxiosHeaders
          ? config.headers
          : new AxiosHeaders(config.headers);

      headers.set(
        "Authorization",
        token.startsWith("Bearer ") ? token : `Bearer ${token}`
      );

      config.headers = headers;
    }
  }

  return config;
});

export default api;
