import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import { CreditCard } from '@mui/icons-material';

export default function CheckoutForm({ orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?order_id=${orderId}`,
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs"
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      
      {message && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}

      <Box sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isLoading || !stripe || !elements}
          startIcon={isLoading ? <CircularProgress size={20} /> : <CreditCard />}
          sx={{ py: 1.5 }}
        >
          {isLoading ? 'Processing...' : 'Pay Now'}
        </Button>

        <Typography variant="caption" display="block" textAlign="center" color="text.secondary" sx={{ mt: 2 }}>
          By completing your purchase, you agree to our terms of service
        </Typography>
      </Box>
    </form>
  );
}
