import { db, auth } from '../adminConfig.mjs';  // Use Firebase Admin SDK

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

// Post a listing
listingsController.postListings = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  
  if (!idToken) {
    return res.status(400).json({ message: 'Authorization token is required' });
  }
  
  const { listing } = req.body;
  
  if (!listing) {
    return res.status(400).json({ message: 'Listing data is required' });
  }
  
  try {
    console.log('in post listings middleware');
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userEmail = userDoc.data().email;

    // Add the new listing to the property_listings collection with a reference to the user
    const newListingRef = db.collection('property_listings').doc();
    await newListingRef.set({
      ...listing,
      userId: userId, // Reference to the user
      userEmail: userEmail, // Store the user's email
      createdAt: new Date().toISOString() // Timestamp for when the listing was created
    });

    // Log the new listing data
    const newListingDoc = await newListingRef.get();
    console.log('Listing successfully posted:', newListingDoc.data());

    res.locals.listings = listing;
    return next();
  } catch (err) {
    console.error('Error in post listings middleware', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's posted listings
listingsController.getUserListings = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(400).json({ message: 'Authorization token is required' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const querySnapshot = await db.collection('property_listings').where('userId', '==', userId).get();

    const userPostings = [];
    querySnapshot.forEach((doc) => {
      userPostings.push(doc.data());
    });

    res.locals.userPostings = userPostings;
    return next();
  } catch (err) {
    console.error('Error in getUserListings middleware', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default listingsController;
