import userController from "./backend/controllers/userController.js";
import stripeController from "./backend/controllers/stripeController.js";
import orderController from "./backend/controllers/orderController.js";
import cartController from "./backend/controllers/cartController.js";
import listingsController from "./backend/controllers/listingsController.js";

import functions from "firebase-functions";
import admin from "firebase-admin";
import express from "express";
import cors from "cors";

// Initialize Firebase Admin SDK (only if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp();
} else {
  admin.app(); // Use the existing app
}

const db = admin.firestore();

const app = express();
app.use(express.json());

// Apply the CORS middleware
app.use(cors({ origin: true }));

// User routes
app.post('/signup', userController.createUser);
app.post('/login', userController.loginUser);
app.delete('/delete/:uid', userController.deleteUser);
app.get('/profile', userController.getUserProfile);

// Listings routes
app.get('/getlistings', listingsController.getListings);
app.post('/postlisting', listingsController.postListings);
app.get('/getuserlistings', listingsController.getUserListings);  // Fixed route

// Order Routes
app.get('/orders', orderController.getOrders);

// Cart Routes
app.post('/posttocart', cartController.postToCart);
app.get('/getcart', cartController.getCart);
app.delete('/deletefromcart', cartController.deleteFromCart);
app.delete('/deleteallfromcart', cartController.deleteAllFromCart);

// Stripe routes
app.post('/createcheckoutsession', stripeController.createCheckoutSession);

// CORS handler for the Chrome extension
const corsHandler = cors({ origin: true });

// Cloud Function to handle submissions from the Chrome extension
export const submitProperty = functions.https.onRequest((req, res) => {
  // Use CORS middleware
  corsHandler(req, res, async () => {
    try {
      const { url, contact } = req.body;

      if (!url || !contact) {
        return res.status(400).json({ message: 'Missing URL or contact information' });
      }

      // Add the submitted property to Firestore
      await db.collection('submitted_properties').add({
        url,
        contact,
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).json({ message: 'Property submitted successfully' });
    } catch (error) {
      console.error('Error submitting property:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
});

// Export the API to Firebase Cloud Functions
export const expressApi = functions.https.onRequest(app);
