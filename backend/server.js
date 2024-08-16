import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from 'cookie-parser'; // Import cookie-parser

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Allow credentials (cookies) to be sent
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Use cookie-parser to handle cookies

// Get the current directory name (since __dirname is not available in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the "build" directory (for production)
app.use(express.static(path.join(__dirname, '../build')));

// Import routes
import userRoute from './routes/userRoute.js';
import stripeRoute from './routes/stripeRoute.js';
import listingsRoute from './routes/listingsRoute.js';
import cartRoute from './routes/cartRoute.js';
import orderRoute from './routes/orderRoute.js';


// API routes
app.use('/api/user', userRoute);
app.use('/api/stripe', stripeRoute);
app.use('/api/listings', listingsRoute);
app.use('/api/cart', cartRoute); 
app.use('/api/orders', orderRoute);


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
