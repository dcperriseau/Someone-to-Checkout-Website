// Import necessary Firebase Admin SDK functions and modules
import { auth, db } from '../adminConfig';  // Use Firebase Admin SDK

const cartController = {};

// Post property listing to cart
cartController.postToCart = async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(400).json({ message: 'Authorization token is required' });
  }

  const { propertyListing } = req.body;

  if (!propertyListing) {
    return res.status(400).json({ message: 'Property listing is required' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data();
    const existingItems = userData.shoppingBasket || [];
    const existingItem = existingItems.find(item => item.id === propertyListing.id);

    if (existingItem) {
      return res.status(200).json({ message: 'Item already in cart' });
    }

    await userRef.update({
      shoppingBasket: [...existingItems, propertyListing]
    });

    return res.status(200).json({ message: 'Item added to cart' });

  } catch (error) {
    console.error('Error posting to cart:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's cart
cartController.getCart = async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(400).json({ message: 'Authorization token is required' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'No shopping cart found for this user' });
    }

    const shoppingBasket = userDoc.data().shoppingBasket || [];
    return res.status(200).json({ items: shoppingBasket });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete user's listing from cart
cartController.deleteFromCart = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(400).json({ message: 'Authorization token is required' });
  }

  const { listingId } = req.body;

  if (!listingId) {
    return res.status(400).json({ message: 'Listing ID is required' });
  }

  try {
    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'No user found' });
    }

    let shoppingCart = userDoc.data().shoppingBasket || [];
    shoppingCart = shoppingCart.filter(item => item.id !== listingId);
    console.log('Updated shopping cart:', shoppingCart); // Log updated cart

    await userRef.update({ shoppingBasket: shoppingCart }, { merge: true });
    console.log('Item deleted from cart successfully');
    res.locals.shoppingCart = shoppingCart;
    return next();
  } catch (err) {
    console.error('Error in delete from cart middleware', err);
    next({ message: 'Error in delete from cart middleware:', error: err.message });
  }
};

// Delete all items from the user's cart
cartController.deleteAllFromCart = async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  console.log('in delete all from cart middleware');
  if (!idToken) {
    return res.status(400).json({ message: 'Authorization token is required' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const purchaserUid = decodedToken.uid;

    // Update the user's document to clear the shoppingBasket field
    await db.collection('users').doc(purchaserUid).update({
      shoppingBasket: []
    });

    res.status(200).json({ message: 'All items deleted from shoppingBasket' });
  } catch (error) {
    console.error('Error deleting items from shoppingBasket:', error);
    res.status(500).json({ error: error.message });
  }
};

export default cartController;
