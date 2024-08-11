import express from 'express';
import cartController from '../controllers/cartController.js';
import authController from '../controllers/authController.js';

const router = express.Router();

// posts users cart to collection
router.post('/posttocart', authController.verifyToken, cartController.postToCart, (req, res) => {
  res.status(200).json({ message: 'Cart successfully posted', shoppingCart: res.locals.shoppingCart, user: res.locals.uid });
});

// gets users cart from collection
router.get('/getcart', authController.verifyToken, cartController.getCart, (req, res) => {
  res.status(200).json({ message: 'Cart successfully got', shoppingCart: res.locals.shoppingCart });
});

// delete users listing from cart
router.delete('/deletefromcart', authController.verifyToken, cartController.deleteFromCart, (req, res) => {
  res.status(200).json({ message: 'Listing successfully deleted from cart', shoppingCart: res.locals.shoppingCart });
});

// delete all listings from cart
router.delete('/deleteAllFromCart', authController.verifyToken, cartController.deleteAllFromCart, (req, res) => {
  res.status(200).json({ message: 'All listings successfully deleted from cart', shoppingCart: res.locals.shoppingCart });
});

export default router;
