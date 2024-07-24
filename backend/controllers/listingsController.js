const { db } = require('../adminConfig');  // Use Firebase Admin SDK

const listingsController = {};

// Get all listings
listingsController.getListings = async (req, res, next) => {
  const listings = [];

  try {
    const querySnapshot = await db.collection('property_listings').get();
    querySnapshot.forEach((doc) => {
      listings.push(doc.data());
    });
    res.locals.listings = listings;
    return next();
  } catch (err) {
    console.error('Error in get listings middleware', err);
    next({ message: 'Error in get listings middleware:', error: err.message });
  }
};

module.exports = listingsController;