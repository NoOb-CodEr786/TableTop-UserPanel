import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";

// Create axios instance with base configuration
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1",
  withCredentials: true, // Important for cookies (refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = useAuthStore.getState();
    const accessToken = state.accessToken;

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: Error) => void }[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    } else {
      prom.reject(new Error('No token available'));
    }
  });
  failedQueue = [];
};

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle 401 errors and token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for the other refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(instance(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1"}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || 'Failed to refresh token');
        }

        // Update the auth store with new tokens
        useAuthStore.getState().updateTokens(data.accessToken, data.refreshToken);
        const state = useAuthStore.getState();

        if (!state.accessToken) {
          throw new Error('No token received after refresh');
        }

        // Update the failed requests with new token
        processQueue(null, state.accessToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${state.accessToken}`;
        }
        return instance(originalRequest);
      } catch (refreshError) {
        // Clear auth and reject all queued requests
        processQueue(refreshError as Error);
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;