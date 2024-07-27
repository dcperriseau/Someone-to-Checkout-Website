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
      uid: userRecord.uid // Ensure uid is stored in Firestore
    };

    console.log('Creating user document in Firestore with UID:', userRecord.uid);
    await db.collection('users').doc(userRecord.uid).set(userData);
    console.log('User document created successfully');

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
  console.log('in login middleware', req.body);
  if (!idToken) {
    return res.status(400).json({ message: 'Missing ID token' });
  }

  try {
    // Verify the ID token
    console.log('i am here in the log in function!!!')
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    console.log('decoded token', decodedToken);
    console.log('UID:', uid);
    
    // Fetch additional user information from Firestore
    console.log('Fetching user document from Firestore for UID:', uid);
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      console.log('User not found in Firestore for UID:', uid);
      return res.status(404).json({ message: 'User not found in Firestore' });
    }
    console.log('User document:', userDoc);

    const userData = userDoc.data();
    console.log('User Data:', userData);
    
    console.log('successfully logged in');
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

// Get logged-in user's profile information
userController.getUserProfile = async (req, res) => {
  console.log('in getUserProfile middleware');

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ message: 'Missing or invalid Authorization header' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    // Verify the ID token
    console.log('Verifying ID token...');
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    console.log('Decoded token:', decodedToken);
    console.log('UID:', uid);

    // Fetch user information from Firestore
    console.log('Fetching user document from Firestore for UID:', uid);
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      console.log('User not found in Firestore for UID:', uid);
      return res.status(404).json({ message: 'User not found in Firestore' });
    }

    console.log('User document:', userDoc);
    const userData = userDoc.data();
    console.log('User Data:', userData);

    res.status(200).json({ message: 'User profile fetched successfully', user: userData });
  } catch (err) {
    console.error('Error verifying ID token or fetching user profile:', err);
    res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
};

module.exports = userController;
