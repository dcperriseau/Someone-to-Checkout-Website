const { auth, db } = require('../adminConfig');  // Use Firebase Admin SDK
const admin = require('firebase-admin');

const userController = {};

// Create user
userController.createUser = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  
  console.log('req.body', req.body);
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  try {
    // Create the user with Firebase Admin SDK
    const userRecord = await auth.createUser({
      email: email,
      password: password, // Pass plaintext password, Admin SDK will handle hashing
      displayName: `${firstName} ${lastName}`, // Correctly set displayName
    });

    // Store additional user information in Firestore
    const userData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('users').doc(userRecord.uid).set(userData);

    res.locals = { uid: userRecord.uid, email, firstName, lastName };

    return next();
  } catch (err) {
    console.error(err); // Log the error for debugging
    next({ log: 'Error in createUser middleware', message: { err: err.message } });
  }
};

// Login user
userController.loginUser = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'Missing ID token' });
  }

  try {
    // Verify the ID token
    console.log('i am here in the log in function!!!')
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Fetch additional user information from Firestore
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found in Firestore' });
    }

    const userData = userDoc.data();
    res.status(200).json({ message: 'Login successful', user: userData });
  } catch (err) {
    console.error('Error verifying ID token:', err);
    res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
};

// Delete user
userController.deleteUser = async (req, res, next) => {
  const { uid } = req.params;
  console.log('req params', req.params);
  try {
    // Delete the user from Firebase Auth
    await auth.deleteUser(uid);

    //Optionally, delete user data from Firestore
    await db.collection('users').doc(uid).delete();

    console.log(`Successfully deleted user with UID: ${uid}`);
    return next();
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};

module.exports = userController;
