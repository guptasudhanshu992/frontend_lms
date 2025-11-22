import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

// Debug function to check auth status
export async function debugAuth() {
  const token = localStorage.getItem('access_token');
  
  console.log('=== Auth Debug Info ===');
  console.log('Token exists:', !!token);
  console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'none');
  
  if (!token) {
    console.error('No token found! Please login first.');
    return false;
  }
  
  try {
    // Test the token with a simple admin endpoint
    const response = await axios.get(`${API_BASE}/api/admin/blogs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Token is VALID ✓');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.error('Token is INVALID or expired ✗');
    console.error('Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('You need to login again!');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
    return false;
  }
}

// Call this in browser console: debugAuth()
window.debugAuth = debugAuth;
