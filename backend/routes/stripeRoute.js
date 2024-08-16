import express from 'express';
import stripeController from '../controllers/stripeController.js';

const router = express.Router();


router.post('/createcheckoutsession', stripeController.createCheckoutSession);

export default router;
