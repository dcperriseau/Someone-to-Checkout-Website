const functions = require('firebase-functions');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripeRoutes = require('./routes/stripeRoute'); 

const app = express();

// Allow requests from your frontend application
app.use(cors({ origin: 'http://localhost:3000' })); 
app.use(bodyParser.json());

app.use('/api/stripe', stripeRoutes);

exports.api = functions.https.onRequest(app);
