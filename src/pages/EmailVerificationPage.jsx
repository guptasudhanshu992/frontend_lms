import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Box,
  Button,
} from '@mui/material';
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid or missing verification token');
        return;
      }

      try {
        const response = await axios.get(`${API_BASE}/api/auth/verify-email`, {
          params: { token },
        });
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.detail || 'Failed to verify email. The link may have expired.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        {status === 'verifying' && (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Verifying Your Email
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we verify your email address...
            </Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle
              sx={{ fontSize: 80, color: 'success.main', mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              Email Verified!
            </Typography>
            <Alert severity="success" sx={{ mt: 2, textAlign: 'left' }}>
              {message}
            </Alert>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Redirecting to login...
            </Typography>
          </>
        )}

        {status === 'error' && (
          <>
            <ErrorIcon
              sx={{ fontSize: 80, color: 'error.main', mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              Verification Failed
            </Typography>
            <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>
              {message}
            </Alert>
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{ mr: 1 }}
              >
                Go to Login
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/register')}
              >
                Register Again
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default EmailVerificationPage;
