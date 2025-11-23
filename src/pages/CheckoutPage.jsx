import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  TextField,
  Chip
} from '@mui/material';
import {
  CheckCircle,
  Lock,
  ArrowBack
} from '@mui/icons-material';
import CheckoutForm from '../components/payment/CheckoutForm';
import api from '../api';

export default function CheckoutPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [order, setOrder] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [stripePromise, setStripePromise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => {
    fetchCourseAndInitiatePayment();
  }, [courseId]);

  const fetchCourseAndInitiatePayment = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const courseResponse = await api.get(`/api/public/courses/${courseId}`);
      setCourse(courseResponse.data);
      
      // Check if course is free
      if (courseResponse.data.price === 0) {
        // Create order for free course
        const orderResponse = await api.post('/api/payments/orders', {
          course_id: parseInt(courseId)
        });
        
        // Redirect to success page
        navigate(`/payment/success?order_id=${orderResponse.data.id}`);
        return;
      }
      
      // Create order
      const orderResponse = await api.post('/api/payments/orders', {
        course_id: parseInt(courseId),
        coupon_code: couponApplied ? couponCode : null
      });
      
      setOrder(orderResponse.data);
      
      // Get Stripe publishable key and create payment intent
      const paymentIntentResponse = await api.post(
        `/api/payments/orders/${orderResponse.data.id}/payment-intent`
      );
      
      setClientSecret(paymentIntentResponse.data.client_secret);
      
      // Initialize Stripe
      const stripe = await loadStripe(paymentIntentResponse.data.publishable_key);
      setStripePromise(stripe);
      
    } catch (err) {
      console.error('Error initiating payment:', err);
      setError(err.response?.data?.detail || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setValidatingCoupon(true);
    try {
      const response = await api.post('/api/payments/coupons/validate', {
        code: couponCode,
        course_id: parseInt(courseId)
      });
      
      if (response.data.valid) {
        setCouponApplied(true);
        setCouponDiscount(response.data);
        // Re-fetch to apply discount
        await fetchCourseAndInitiatePayment();
      } else {
        setError(response.data.message || 'Invalid coupon code');
      }
    } catch (err) {
      setError('Failed to validate coupon');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const calculateDiscount = () => {
    if (!couponDiscount || !course) return 0;
    
    if (couponDiscount.discount_type === 'percentage') {
      let discount = course.price * (couponDiscount.discount_value / 100);
      if (couponDiscount.max_discount) {
        discount = Math.min(discount, couponDiscount.max_discount);
      }
      return discount;
    } else if (couponDiscount.discount_type === 'fixed') {
      return Math.min(couponDiscount.discount_value, course.price);
    }
    return 0;
  };

  const finalAmount = order ? order.total_amount : (course ? course.price - calculateDiscount() : 0);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !course) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button onClick={() => navigate('/courses')} startIcon={<ArrowBack />}>
          Back to Courses
        </Button>
      </Container>
    );
  }

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button
        onClick={() => navigate(`/courses/${courseId}`)}
        startIcon={<ArrowBack />}
        sx={{ mb: 3 }}
      >
        Back to Course
      </Button>

      <Grid container spacing={4}>
        {/* Checkout Form */}
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Lock sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="h5" fontWeight="bold">
                Secure Checkout
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {!couponApplied && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Have a coupon code?
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={validatingCoupon}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || validatingCoupon}
                  >
                    {validatingCoupon ? <CircularProgress size={24} /> : 'Apply'}
                  </Button>
                </Box>
              </Box>
            )}

            {couponApplied && (
              <Alert severity="success" sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Coupon "{couponCode}" applied!</span>
                  <Button size="small" onClick={() => {
                    setCouponApplied(false);
                    setCouponCode('');
                    setCouponDiscount(null);
                  }}>
                    Remove
                  </Button>
                </Box>
              </Alert>
            )}

            <Divider sx={{ my: 3 }} />

            {clientSecret && stripePromise && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm orderId={order?.id} />
              </Elements>
            )}
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={5}>
          <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />

              {course && (
                <>
                  {course.image_url && (
                    <Box
                      component="img"
                      src={course.image_url}
                      alt={course.title}
                      sx={{
                        width: '100%',
                        height: 150,
                        objectFit: 'cover',
                        borderRadius: 1,
                        mb: 2
                      }}
                    />
                  )}

                  <Typography variant="h6" gutterBottom>
                    {course.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {course.description?.substring(0, 100)}...
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip label={course.level} size="small" />
                    <Chip label={course.duration} size="small" />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Course Price:</Typography>
                      <Typography variant="body2">${course.price.toFixed(2)}</Typography>
                    </Box>

                    {couponApplied && calculateDiscount() > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, color: 'success.main' }}>
                        <Typography variant="body2">Discount:</Typography>
                        <Typography variant="body2">-${calculateDiscount().toFixed(2)}</Typography>
                      </Box>
                    )}

                    <Divider sx={{ my: 1 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" fontWeight="bold">
                        Total:
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        ${finalAmount.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  <Alert severity="info" icon={<CheckCircle />} sx={{ mt: 3 }}>
                    <Typography variant="body2">
                      30-day money-back guarantee
                    </Typography>
                  </Alert>
                </>
              )}
            </CardContent>
          </Card>

          <Card elevation={1} sx={{ mt: 2, bgcolor: 'grey.50' }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                🔒 Secure Payment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your payment information is encrypted and secure. We never store your card details.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
