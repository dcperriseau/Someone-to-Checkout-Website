const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripeRoutes = require('./routes/routes/stripeRoute'); 

const app = express();

// Allow requests from your frontend application
app.use(cors({ origin: 'http://localhost:3000' })); 

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Define the route for Stripe API
app.use('/api/stripe', stripeRoutes);

// Define the port to run the server on
const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
