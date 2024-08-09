const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "build" directory (for production)
app.use(express.static(path.join(__dirname, '../build')));

// Import routes
//const userRoute = require('./routes/userRoute');
const stripeRoute = require('./routes/stripeRoute');
//const listingsRoute = require('./routes/listingsRoute');
//const cartRoute = require('./routes/cartRoute');
//const orderRoute = require('./routes/orderRoute');

// API routes
//app.use('/api/user', userRoute);
//app.use('/api/stripe', stripeRoute);
//app.use('/api/listings', listingsRoute);
//app.use('/api/cart', cartRoute); 
//app.use('/api/orders', orderRoute);
app.use('/api/stripe', stripeRoute); 

// Serve the React app for any unknown routes (for Single Page Application support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.error(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
