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
  (config) => {
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
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@Auth:access_token');
      localStorage.removeItem('@Auth:user');
      localStorage.removeItem('@Auth:refresh_token');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
