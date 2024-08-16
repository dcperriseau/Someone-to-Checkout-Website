import Stripe from 'stripe';
import { db, auth } from '../adminConfig.js'; // Ensure auth is imported for token verification

// Initialize Stripe
const stripe = new Stripe('sk_test_51PKNI2GDWcOLiYf23iB6UbyUVg5HVBqVAdAOVhyI6wtrVR5XFv1cwuMxX9s8k0QJ5ZpwKIGNQeBid2aJzM6drs4P00LjAfcWC7');

const stripeController = {};

stripeController.createCheckoutSession = async (req, res) => {
  const { items, uid } = req.body; // Accept uid from the request body
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or incorrect format' });
  }

  const token = authHeader.split('Bearer ')[1];
  console.log('Authorization Header:', authHeader); // Log the auth header
  console.log('Token extracted:', token); // Log the extracted token

  try {
    // Verify the token
    const decodedToken = await auth.verifyIdToken(token);
    console.log('Decoded Token:', decodedToken); // Log the decoded token

    // Fetch the user's document from Firestore using the uid
    const purchaserDoc = await db.collection('users').doc(uid).get();
    if (!purchaserDoc.exists) {
      return res.status(404).json({ message: 'Purchaser not found' });
    }
    const purchaserEmail = purchaserDoc.data().email;

    // Prepare line items for Stripe checkout session
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: 3000, // Set the price to $30.00 (3000 cents)
      },
      quantity: 1,
    }));

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    // Save the order to Firestore
    const orderData = {
      purchaserUid: uid, // Use the uid directly
      purchaserEmail,
      items: items.map(item => ({
        ...item,
        price: 30, // Explicitly set the price to 30 dollars for each item in the order
      })),
      createdAt: new Date().toISOString(),
      status: 'pending', // Initial status
    };

    const orderRef = await db.collection('orders').add(orderData);
    console.log('Order created in Firestore with ID:', orderRef.id);

    // Return the session ID to the frontend
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error verifying token or creating checkout session:', error);
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

export default stripeController;
