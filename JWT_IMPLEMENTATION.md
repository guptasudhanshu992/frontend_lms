# JWT Authentication Flow - Implementation Guide

## Overview
This document describes the professional JWT authentication implementation for both admin and student users.

## Key Features

### 1. **Centralized Token Management** (`utils/authUtils.js`)
- Consistent token storage and retrieval
- Automatic expiry checking
- Token decode utilities
- User data management

### 2. **Automatic Token Refresh** (`api/index.js`)
- Axios interceptors automatically add Bearer tokens to requests
- 401 errors trigger automatic token refresh
- Failed requests are queued and retried after refresh
- Prevents multiple simultaneous refresh attempts
- Automatic redirect to login on refresh failure

### 3. **Secure Token Storage**
- Access tokens stored in localStorage
- Refresh tokens stored in localStorage (consider httpOnly cookies for production)
- Token expiry tracked separately for proactive refresh
- User data cached for quick access

### 4. **Admin Route Protection** (`components/AdminRoute.jsx`)
- Verifies authentication before rendering admin pages
- Checks user role (must be 'admin')
- Shows loading state during verification
- Redirects to login if unauthorized

### 5. **Simplified API Calls** (`hooks/useAdminApi.js`)
- Custom React hook for API calls
- No need to manually handle tokens
- Consistent error handling
- Automatic token refresh on 401

## Backend Implementation

### Token Endpoints

#### 1. **Login** - `/api/auth/login` & `/api/admin/auth/login`
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

Response:
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "student",
    "full_name": "John Doe"
  }
}
```

#### 2. **Refresh** - `/api/auth/refresh`
```json
POST /api/auth/refresh
Cookie: refresh_token=eyJ...

Response:
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

#### 3. **Verify Admin** - `/api/admin/me`
```json
GET /api/admin/me
Authorization: Bearer eyJ...

Response:
{
  "id": 0,
  "email": "admin@lms.com",
  "role": "admin",
  "is_active": true
}
```

#### 4. **Logout** - `/api/auth/logout`
```json
POST /api/auth/logout
Cookie: refresh_token=eyJ...

Response:
{
  "ok": true
}
```

### Token Configuration
- **Access Token**: 15 minutes (900 seconds) - Short-lived for security
- **Refresh Token**: 7 days (604800 seconds) - Long-lived for convenience
- **Algorithm**: HS256
- **Claims**: sub (user_id), exp (expiry), type (access/refresh), jti (unique ID)
- **Extra Claims**: email, role (for admin)

## Frontend Implementation

### 1. Login Flow

```javascript
import { setAuthData } from '../utils/authUtils';
import api from '../api';

const handleLogin = async (email, password) => {
  const response = await api.post('/api/admin/auth/login', { email, password });
  const { access_token, refresh_token, user } = response.data;
  
  // Store auth data - automatically calculates expiry
  setAuthData(access_token, refresh_token, user);
  
  // Navigate to dashboard
  navigate('/admin/dashboard');
};
```

### 2. Making Authenticated Requests

#### Option A: Using the Custom Hook (Recommended for Admin Pages)
```javascript
import useAdminApi from '../../hooks/useAdminApi';

const MyComponent = () => {
  const adminApi = useAdminApi();
  
  const fetchData = async () => {
    try {
      const data = await adminApi.get('/api/admin/users');
      // Use data...
    } catch (error) {
      console.error('API error:', error);
    }
  };
};
```

#### Option B: Direct API Calls
```javascript
import api from '../api';

const fetchData = async () => {
  // Token automatically added by interceptor
  const response = await api.get('/api/admin/stats');
  return response.data;
};
```

### 3. Protected Routes

```javascript
import AdminRoute from '../components/AdminRoute';

<Route
  path="/admin/dashboard"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
```

### 4. Logout Flow

```javascript
import { clearAuthData } from '../utils/authUtils';
import api from '../api';

const handleLogout = async () => {
  try {
    await api.post('/api/auth/logout');
  } finally {
    clearAuthData();
    navigate('/admin/login');
  }
};
```

## Token Refresh Flow

### Automatic Refresh Process
1. User makes API request
2. If access token expired, API returns 401
3. Axios interceptor catches 401
4. Interceptor checks for refresh token
5. If refresh token exists:
   - Call `/api/auth/refresh` endpoint
   - Get new access token
   - Update localStorage
   - Retry original failed request
   - Retry all queued requests
6. If refresh fails:
   - Clear all auth data
   - Redirect to login page

### Preventing Multiple Refresh Attempts
- Uses `isRefreshing` flag to track refresh status
- Queues additional requests while refresh in progress
- Processes all queued requests after successful refresh

## Security Best Practices

### Current Implementation
✅ Access tokens expire in 15 minutes
✅ Refresh tokens expire in 7 days
✅ Tokens include unique JTI (JWT ID)
✅ HTTPS enforced in production
✅ withCredentials: true for cookie support
✅ Automatic logout on refresh failure

### Production Recommendations
1. **Store refresh tokens in httpOnly cookies** - Already set up on backend
2. **Implement token rotation** - Issue new refresh token on each refresh
3. **Add CSRF protection** - Use double-submit cookie pattern
4. **Rate limit refresh endpoint** - Prevent brute force attacks
5. **Implement token revocation** - Track tokens in database
6. **Add fingerprinting** - Bind tokens to device/browser
7. **Use secure flag on cookies** - Already implemented (secure=not DEBUG)

## Migration Guide for Existing Components

### Before (Old Pattern):
```javascript
const fetchData = async () => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get(`${API_BASE}/api/admin/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  setData(response.data);
};
```

### After (New Pattern):
```javascript
import useAdminApi from '../../hooks/useAdminApi';

const fetchData = async () => {
  const adminApi = useAdminApi();
  const data = await adminApi.get('/api/admin/users');
  setData(data);
};
```

### Benefits:
- No manual token management
- Automatic token refresh
- Consistent error handling
- Cleaner code
- Better TypeScript support potential

## Troubleshooting

### Issue: "Missing refresh token" error on admin login
**Solution**: Ensure `withCredentials: true` is set in axios config

### Issue: Token expired but still logged in
**Solution**: Implemented! Axios interceptor now catches 401 errors and refreshes automatically

### Issue: Infinite refresh loop
**Solution**: Implemented! `_retry` flag prevents retrying failed refresh attempts

### Issue: Multiple refresh attempts
**Solution**: Implemented! `isRefreshing` flag and request queue prevent parallel refreshes

### Issue: Redirect after token refresh
**Solution**: Implemented! Original request is retried with new token instead of redirecting

## Testing Checklist

- [ ] Admin login stores tokens correctly
- [ ] Student login stores tokens correctly
- [ ] Access token automatically added to requests
- [ ] 401 errors trigger automatic refresh
- [ ] Multiple simultaneous 401s don't cause multiple refresh calls
- [ ] Failed refresh redirects to login
- [ ] Logout clears all tokens
- [ ] Protected routes check authentication
- [ ] Admin routes verify role
- [ ] Token expiry is tracked correctly
- [ ] Expired tokens trigger refresh proactively (optional enhancement)

## Files Modified/Created

### Created:
- `frontend/src/utils/authUtils.js` - Token management utilities
- `frontend/src/hooks/useAdminApi.js` - Admin API hook
- `frontend/src/components/AdminRoute.jsx` - Route protection
- `frontend/JWT_IMPLEMENTATION.md` - This documentation

### Modified:
- `frontend/src/api/index.js` - Added interceptors and token refresh
- `frontend/src/context/AuthContext.jsx` - Updated to use authUtils
- `frontend/src/pages/admin/AdminLoginPage.jsx` - Updated to use authUtils
- `frontend/src/pages/admin/AdminDashboard.jsx` - Example using useAdminApi hook
- `backend/app/routers/admin.py` - Added /me endpoint
- `backend/app/core/jwt.py` - Enhanced token functions

## Next Steps

1. **Update all admin components** to use `useAdminApi` hook
2. **Implement AdminRoute** wrapper in routing configuration
3. **Test token refresh** with expired tokens
4. **Consider httpOnly cookies** for refresh tokens
5. **Add token rotation** for enhanced security
6. **Implement CSRF protection** if needed
7. **Add rate limiting** to refresh endpoint
8. **Set up monitoring** for failed refresh attempts
