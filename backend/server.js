const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());

// Import routes
const userRoute = require('./routes/userRoute');
const stripeRoute = require('./routes/stripeRoute');
const listingsRoute = require('./routes/listingsRoute');
const cartRoute = require('./routes/cartRoute');
const orderRoute = require('./routes/orderRoute');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// User routes
app.use('/api/user', userRoute);
app.use('/api/stripe', stripeRoute);
app.use('/api/listings', listingsRoute);
app.use('/api/cart', cartRoute); 
app.use('/api/orders', orderRoute);

// serve the React app for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// catch all
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
