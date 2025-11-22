/**
 * Centralized authentication utility functions
 */

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';
const TOKEN_EXPIRY_KEY = 'token_expiry';

/**
 * Store authentication data in localStorage
 */
export const setAuthData = (accessToken, refreshToken, user, expiresIn = 900) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  // Calculate expiry time (current time + expiresIn seconds - 30 second buffer)
  const expiryTime = Date.now() + (expiresIn - 30) * 1000;
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
};

/**
 * Get access token from localStorage
 */
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Get user data from localStorage
 */
export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Check if access token is expired or about to expire
 */
export const isTokenExpired = () => {
  const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiryTime) return true;
  return Date.now() >= parseInt(expiryTime);
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getAccessToken();
  return !!token;
};

/**
 * Decode JWT token (without verification - for client-side inspection only)
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

/**
 * Get token expiry from JWT payload
 */
export const getTokenExpiry = (token) => {
  const decoded = decodeToken(token);
  return decoded?.exp ? decoded.exp * 1000 : null; // Convert to milliseconds
};
