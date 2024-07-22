const { auth, db } = require('../adminConfig');  // Use Firebase Admin SDK
const admin = require('firebase-admin');

const userController = {};

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
  } catch (error) {
    console.error(error); // Log the error for debugging
    next({ log: 'Error in createUser middleware', message: { err: error.message } });
  }
};

userController.loginUser = async (req, res) => {
  // Implement the login logic here
};

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
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};


module.exports = userController;
