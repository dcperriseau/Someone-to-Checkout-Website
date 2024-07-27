const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

//posts users cart to collection
router.post('/posttocart', authController.verifyToken, cartController.postToCart, (req, res) => {
  res.status(200).json({ message: 'Cart successfully posted', shoppingCart: res.locals.shoppingCart, user: res.locals.uid });
})

//gets users cart from collection
router.get('/getcart', authController.verifyToken, cartController.getCart, (req, res) => {
  res.status(200).json({ message: 'Cart successfully got', shoppingCart: res.locals.shoppingCart });
}) 

router.delete('/deletefromcart', authController.verifyToken, cartController.deleteFromCart, (req, res) => {
  res.status(200).json({ message: 'Listing successfully deleted from cart', shoppingCart: res.locals.shoppingCart });
})

router.delete('/deleteAllFromCart', authController.verifyToken, cartController.deleteAllFromCart, (req, res) => {
  res.status(200).json({ message: 'All listings successfully deleted from cart', shoppingCart: res.locals.shoppingCart });
});

module.exports = router;