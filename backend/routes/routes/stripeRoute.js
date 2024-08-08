const express = require('express');
const router = express.Router();
const stripeController = require('../../controllers/stripeController'); // Adjust the path if necessary

router.post('/createcheckoutsession', stripeController.createCheckoutSession);

module.exports = router;
