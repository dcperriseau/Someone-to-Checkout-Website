const express = require('express');
const router = express.Router();
const listingsController = require('../controllers/listingsController');
const authController = require('../controllers/authController');

router.get('/getlistings', listingsController.getListings, (req, res) => {
  res.status(200).json( {message: 'listings successfully got', listings: res.locals.listings } )
})
router.post('/postlisting', authController.verifyToken, listingsController.postListings, (req, res) => {
  res.status(200).json( {message: 'listings successfully posted', listings: res.locals.listings } )
})
router.get('/getuserlistings', listingsController.getUserListings, (req, res) => {
  return res.json(res.locals.userPostings);
});

module.exports = router;