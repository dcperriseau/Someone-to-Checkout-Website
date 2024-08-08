const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const { db, auth } = require('../../src/firebaseConfig');

const stripeController = {};

stripeController.createCheckoutSession = async (req, res) => {
  const { items } = req.body;
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(400).json({ message: 'Authorization token is required' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const purchaserUid = decodedToken.uid;

    const purchaserDoc = await db.collection('users').doc(purchaserUid).get();
    if (!purchaserDoc.exists) {
      return res.status(404).json({ message: 'Purchaser not found' });
    }
    const purchaserEmail = purchaserDoc.data().email;

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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    // Save the order to Firestore
    const orderData = {
      purchaserUid,
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

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = stripeController;
