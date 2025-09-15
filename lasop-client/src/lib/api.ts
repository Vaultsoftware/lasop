// lasop-client/src/lib/api.ts
import axios from 'axios';
import { getTokenFromStorage } from '@/utils/token';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const already =
    (config.headers && (config.headers as any).Authorization) ||
    (config.headers && (config.headers as any).authorization);

  if (!already) {
    const token = getTokenFromStorage();
    if (token) {
      if (!config.headers) config.headers = {};
      (config.headers as any).Authorization = token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
