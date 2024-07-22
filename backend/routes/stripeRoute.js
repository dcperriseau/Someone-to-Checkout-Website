const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51PKNI2GDWcOLiYf23iB6UbyUVg5HVBqVAdAOVhyI6wtrVR5XFv1cwuMxX9s8k0QJ5ZpwKIGNQeBid2aJzM6drs4P00LjAfcWC7');

router.post('/create-checkout-session', async (req, res) => {
  console.log('we are in the create checkout back end');
  const { items } = req.body;

  console.log('Received items:', items);

  const lineItems = items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: [`http://localhost:3000${item.image}`],
      },
      unit_amount: item.price * 100,
    },
    quantity: 1,
  }));

  console.log('Line items:', lineItems);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    console.log('Session created:', session);

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
