import axios from 'axios';
import { getTokenFromStorage } from '@/utils/token';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const hasAuthHeader =
    !!config.headers &&
    (('Authorization' in config.headers) || ('authorization' in config.headers));

  if (!hasAuthHeader) {
    const token = getTokenFromStorage?.();
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers['Authorization'] = token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
