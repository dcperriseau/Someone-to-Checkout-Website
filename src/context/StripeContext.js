import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// stripe publishable key
const stripePromise = loadStripe('pk_test_51PKNI2GDWcOLiYf2jKY1gkCudeZCUSiPVQFMno0rYR7eZzdtbCWRaMKkKFcRKwRkR3x5vpciTQyAyvxswHauk70g00tOcFkqmP'); 

const StripeContext = ({ children }) => (
  <Elements stripe={stripePromise}>
    {children}
  </Elements>
);

export default StripeContext;
