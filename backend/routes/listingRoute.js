const express = require('express');
const router = express.Router();
const listingsController = require('../controllers/listingsController');

router.get('/getlistings', listingsController.getListings, (req, res) => {
  res.status(200).json( {message: 'listings successfully got', listings: res.locals.listings } )
})

module.exports = router;