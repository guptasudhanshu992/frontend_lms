import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { isAuthenticated, getUser } from '../../utils/authUtils';

/**
 * Protected route wrapper for admin pages
 * Checks authentication and verifies user role
 */
export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      // Check if user has token
      if (!isAuthenticated()) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      // Get user from localStorage
      const user = getUser();
      
      // Check if user has admin role
      if (user && user.role === 'admin') {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [location]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!authorized) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
