import axios from 'axios';
import type { AxiosRequestHeaders } from 'axios';

export const HOST = 'http://localhost:8080/api/v1';

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
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);