import axios from 'axios';
import type { AxiosRequestHeaders } from 'axios';

export const HOST = 'https://materials-backend-production.up.railway.app/api/v1';

export const axiosInstance = axios.create({
  baseURL: HOST,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('@Auth:refresh_token');
    if (!refreshToken) throw new Error('No refresh token');
    
    const response = await axios.post(`${HOST}/authentication/refresh`, {
      refreshToken: refreshToken
    });
    
    localStorage.setItem('@Auth:access_token', response.data.accessToken);
    localStorage.setItem('@Auth:refresh_token', response.data.refreshToken);
    return response.data.accessToken;
  } catch (error) {
    localStorage.removeItem('@Auth:access_token');
    localStorage.removeItem('@Auth:refresh_token');
    window.location.href = '/login';
    throw error;
  }
};

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
  response => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);