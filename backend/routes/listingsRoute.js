import express from 'express';
import listingsController from '../controllers/listingsController.js';
import authController from '../controllers/authController.js';

const router = express.Router();

router.get('/getlistings', listingsController.getListings, (req, res) => {
  res.status(200).json({ message: 'listings successfully got', listings: res.locals.listings });
});

router.post('/postlisting', authController.verifyToken, listingsController.postListings, (req, res) => {
  res.status(200).json({ message: 'listings successfully posted', listings: res.locals.listings });
});

router.get('/getuserlistings', listingsController.getUserListings, (req, res) => {
  return res.json(res.locals.userPostings);
});

export default router;
