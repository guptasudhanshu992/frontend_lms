import { useCallback } from 'react';
import api from '../api';

/**
 * Custom hook for making authenticated API calls
 * Automatically handles token management through axios interceptors
 */
export const useAdminApi = () => {
  const apiCall = useCallback(async (method, url, data = null, config = {}) => {
    try {
      let response;
      
      switch (method.toLowerCase()) {
        case 'get':
          response = await api.get(url, config);
          break;
        case 'post':
          response = await api.post(url, data, config);
          break;
        case 'put':
          response = await api.put(url, data, config);
          break;
        case 'delete':
          response = await api.delete(url, config);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`API call failed: ${method} ${url}`, error);
      throw error;
    }
  }, []);

  return {
    get: useCallback((url, config) => apiCall('get', url, null, config), [apiCall]),
    post: useCallback((url, data, config) => apiCall('post', url, data, config), [apiCall]),
    put: useCallback((url, data, config) => apiCall('put', url, data, config), [apiCall]),
    delete: useCallback((url, config) => apiCall('delete', url, null, config), [apiCall]),
  };
};

export default useAdminApi;
