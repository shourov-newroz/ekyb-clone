import BACKEND_ENDPOINTS from '@/api/urls';
import { authService } from '@/utils/authService';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { BACKEND_BASE_URL } from './config';

// Create axios instance
const api = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const { accessToken, refreshToken, expiresAt } =
    authService.getTokenDetails();

  // Skip token logic if tokens are missing (public APIs) or if the request is for refreshing token
  if (
    !accessToken ||
    !refreshToken ||
    config.url === BACKEND_ENDPOINTS.REFRESH_TOKEN
  ) {
    return config;
  }

  // Check if token needs refreshing
  if (authService.isTokenExpired(expiresAt)) {
    try {
      await authService.refreshToken();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // Add token to request if available
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // If tokens are missing, reject the request (skip retrying)
    const { accessToken, refreshToken } = authService.getTokenDetails();
    if (
      !originalRequest ||
      !accessToken ||
      !refreshToken ||
      originalRequest.url === BACKEND_ENDPOINTS.REFRESH_TOKEN
    ) {
      return Promise.reject(error);
    }

    // Handle 401 errors
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data || '';

      // Handle invalid access/refresh token before expiry
      if (
        errorMessage === 'invalid_token' ||
        errorMessage === 'token_revoked'
      ) {
        authService.logout(); // Clear tokens and redirect to login
        return Promise.reject(
          new Error('Session expired. Please log in again.')
        );
      }

      try {
        await authService.refreshToken(); // Attempt to refresh token
        return api(originalRequest); // Retry original request
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
