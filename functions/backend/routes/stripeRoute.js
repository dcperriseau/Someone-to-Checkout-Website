import express from 'express';
import authController from '../controllers/authController.js';
import stripeController from '../controllers/stripeController.js';

const router = express.Router();

router.post('/createcheckoutsession', authController.verifyToken, stripeController.createCheckoutSession);

export default router;
