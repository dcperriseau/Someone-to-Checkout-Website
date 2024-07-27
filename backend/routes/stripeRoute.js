const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const stripeController = require('../controllers/stripeController');

router.post('/createcheckoutsession', authController.verifyToken, stripeController.createCheckoutSession);

module.exports = router;
