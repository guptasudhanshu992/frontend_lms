import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const accessToken = searchParams.get('access_token');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError(`OAuth failed: ${errorParam}`);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (!accessToken) {
        setError('No access token received');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        // Store the token
        localStorage.setItem('access_token', accessToken);
        
        // Update auth context (this will trigger a user info fetch)
        await login({ access_token: accessToken });
        
        // Redirect to dashboard
        navigate('/dashboard');
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Failed to complete OAuth login');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, login]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        {error ? (
          <>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Redirecting to login...
            </Typography>
          </>
        ) : (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Completing Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait...
            </Typography>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default OAuthCallbackPage;
