import express from 'express';
import orderController from '../controllers/orderController.js';
import authController from '../controllers/authController.js';

const router = express.Router();

router.get('/getorders', authController.verifyToken, orderController.getOrders);

export default router;
