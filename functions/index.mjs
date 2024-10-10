import userController from "./backend/controllers/userController.js";
import stripeController from "./backend/controllers/stripeController.js";
import orderController from "./backend/controllers/orderController.js";
import cartController from "./backend/controllers/cartController.js";
import listingsController from "./backend/controllers/listingsController.js";

import functions from "firebase-functions";
import admin from "firebase-admin";
import express from "express";
import cors from "cors";
import sgMail from '@sendgrid/mail';

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

// Get sendGrid api key that was set in terminal 
const SENDGRID_API_KEY = functions.config().sendgrid.api_key;
sgMail.setApiKey(SENDGRID_API_KEY);

// Cloud Function to send both confirmation and notification emails
export const sendUsageEmails = functions.https.onRequest((req, res) => {
  // Use CORS middleware
  corsHandler(req, res, async () => {
    try {
      const { userEmail } = req.body;

      if (!userEmail) {
        return res.status(400).json({ message: 'Missing user email' });
      }

      // 1. Confirmation email to the user
      const userMsg = {
        to: userEmail,
        from: 'dibby@someonetocheckout.com',
        subject: 'Confirmation: Thank you for using Dibby!',
        text: 'Hi there,\n\nThank you for using Dibby. Someone from our team will be in touch with you very soon about your requested viewing.',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Hi there,</h2>
            <p>Thank you for using <strong>Dibby</strong>. Someone from our team will be in touch with you very soon regarding your requested viewing.</p>
            <p>If you have any questions, feel free to reply to this email or contact us at <a href="mailto:dibby@someonetocheckout.com">dibby@someonetocheckout.com</a>.</p>
            <br>
            <p>Best regards,</p>
            <p>The Dibby Team</p>
            <hr style="border:none; border-top:1px solid #ddd; margin:20px 0;">
            <p style="font-size:12px; color:#999;">You are receiving this email because you used the Dibby Chrome Extension. If you did not make this request, please ignore this email.</p>
          </div>
        `,
      };

      // 2. Notification email to yourself
      const notificationMsg = {
        to: 'dibby@someonetocheckout.com', // email for receiving notifications
        from: 'dibby@someonetocheckout.com', 
        subject: 'New Usage Notification from Dibby Extension',
        text: `The Chrome extension was used by ${userEmail}. Check firebase for details.`,
      };

      // Send both emails in parallel
      await Promise.all([sgMail.send(userMsg), sgMail.send(notificationMsg)]);

      res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error) {
      console.error('Error sending emails:', error);
      res.status(500).json({ message: 'Failed to send emails', error: error.message });
    }
  });
});

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

      await sendUsageEmails();

      res.status(200).json({ message: 'Property submitted successfully' });
    } catch (error) {
      console.error('Error submitting property:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
});

// Export the API to Firebase Cloud Functions
export const expressApi = functions.https.onRequest(app);
