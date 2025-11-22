import axios from 'axios'
import { getAccessToken, setAuthData, clearAuthData, isTokenExpired, getRefreshToken } from '../utils/authUtils'

// Default to the Fly app domain. You can override this by creating `frontend/.env`
// with `VITE_API_BASE=https://lmsbackend.fly.dev/` or by setting the variable
// in Cloudflare Pages environment variables when deploying the frontend.

//const DEFAULT_BASE = 'https://lmsbackend.fly.dev/'
const DEFAULT_BASE = 'http://127.0.0.1:8000/'

const BASE = (import.meta.env.VITE_API_BASE || DEFAULT_BASE).replace(/\/+$/,'')

export const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Important for cookies
})

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - add access token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Check if we have a refresh token
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearAuthData();
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Attempt to refresh the token
      const response = await axios.post(
        `${BASE}/api/auth/refresh`,
        {},
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const { access_token } = response.data;
      
      // Update stored token (keep existing refresh token and user)
      const currentUser = localStorage.getItem('user');
      setAuthData(access_token, refreshToken, currentUser ? JSON.parse(currentUser) : null);

      // Update authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      originalRequest.headers.Authorization = `Bearer ${access_token}`;

      // Process queued requests
      processQueue(null, access_token);

      isRefreshing = false;

      // Retry original request
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      isRefreshing = false;
      
      // Clear auth data and redirect to login
      clearAuthData();
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
      
      return Promise.reject(refreshError);
    }
  }
);

export default api
