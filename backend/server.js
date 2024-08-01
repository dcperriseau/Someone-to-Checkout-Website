const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripeRoutes = require('./routes/stripeRoute'); // Adjusted path

const app = express();

// Allow requests from your frontend application
app.use(cors({ origin: 'http://localhost:3000' })); // Adjust the origin as per your setup
app.use(bodyParser.json());

app.use('/api/stripe', stripeRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
