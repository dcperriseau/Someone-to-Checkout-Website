const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController'); 
const authController = require('../controllers/authController');

router.get('/getorders', authController.verifyToken, orderController.getOrders);

module.exports = router;