
import userController from "./backend/controllers/userController.js";
import stripeController from "./backend/controllers/stripeController.js";
import orderController from "./backend/controllers/orderController.js";
import cartController from "./backend/controllers/cartController.js";
import listingsController from "./backend/controllers/listingsController.js";

import functions from "firebase-functions";
import admin from "firebase-admin";
import express from "express";
import cors from "cors"; 

//import "dotenv/config";

// Initialize Firebase Admin SDK
//admin.initializeApp();
//const db = admin.firestore();

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
app.get('getuserlistings', listingsController.getUserListings);

// Order Routes
app.get('/orders', orderController.getOrders);

// Cart Routes
app.post('/posttocart',cartController.postToCart);
app.get('/getcart',cartController.getCart);
app.delete('/deletefromcart',cartController.deleteFromCart);
app.delete('/deleteallfromcart', cartController.deleteAllFromCart);

// stripe routes
app.post('/createcheckoutsession', stripeController.createCheckoutSession);

// Export the API to Firebase Cloud Functions
// exports.expressApi = functions.https.onRequest(app);
export const expressApi = functions.https.onRequest(app);
// export default app.router;
