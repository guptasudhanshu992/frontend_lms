import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  CheckCircle,
  ErrorOutline,
  Home,
  School
} from '@mui/icons-material';
import api from '../api';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id');
  const paymentIntentId = searchParams.get('payment_intent');
  
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId || paymentIntentId) {
      confirmPayment();
    } else {
      setError('Invalid payment information');
      setLoading(false);
    }
  }, [orderId, paymentIntentId]);

  const confirmPayment = async () => {
    try {
      // If we have payment_intent, confirm it first
      if (paymentIntentId) {
        await api.post('/api/payments/confirm', {
          payment_intent_id: paymentIntentId
        });
      }
      
      // Fetch order details
      if (orderId) {
        const response = await api.get(`/api/payments/orders/${orderId}`);
        setOrder(response.data);
      }
    } catch (err) {
      console.error('Error confirming payment:', err);
      setError(err.response?.data?.detail || 'Failed to confirm payment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={60} />
          <Typography variant="h6">Confirming your payment...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <ErrorOutline sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Payment Failed
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/courses')}
            sx={{ mt: 2 }}
          >
            Back to Courses
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Payment Successful!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Thank you for your purchase
          </Typography>
        </Box>

        {order && (
          <Card variant="outlined" sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Order Number:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {order.order_number}
                </Typography>
              </Box>

              {order.course_title && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Course:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {order.course_title}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Amount Paid:
                </Typography>
                <Typography variant="body2" fontWeight="medium" color="primary">
                  ${order.total_amount.toFixed(2)} {order.currency}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Status:
                </Typography>
                <Typography variant="body2" fontWeight="medium" color="success.main">
                  {order.status}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body2">
            You now have full access to the course! A confirmation email has been sent to your inbox.
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<School />}
            onClick={() => navigate(order ? `/courses/${order.course_id}` : '/my-courses')}
            size="large"
          >
            Go to Course
          </Button>
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={() => navigate('/courses')}
            size="large"
          >
            Browse More Courses
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
