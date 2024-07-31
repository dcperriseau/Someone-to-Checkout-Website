const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripeRoutes = require('./stripeRoute');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/stripe', stripeRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
