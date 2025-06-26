import axios from 'axios';
import type { AxiosRequestHeaders } from 'axios';

export const HOST = 'https://materials-backend-production.up.railway.app/api/v1';

export const axiosInstance = axios.create({
  baseURL: HOST,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('@Auth:access_token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);