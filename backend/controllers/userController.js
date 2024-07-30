const { auth, db } = require('../adminConfig');  // Use Firebase Admin SDK
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

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

    // Generate email verification link
    const verificationLink = await auth.generateEmailVerificationLink(email);
    console.log('Verification email link generated:', verificationLink);

    // Set up Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail account
        pass: process.env.EMAIL_PASS, // Your Gmail password or app-specific password
      },
    });
    console.log ('email and pass:', process.env.EMAIL_USER, process.env.EMAIL_PASS);
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // Send the email to the user's email address
      subject: 'Please verify your email',
      text: `Click on the following link to verify your email: ${verificationLink}`,
      html: `<p>Click on the following link to verify your email:</p><a href="${verificationLink}">Verify Email</a>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);

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

    res.status(200).json({ message: 'User created successfully, please verify your email.' });
  } catch (err) {
    console.error(err); // Log the error for debugging
    next({ log: 'Error in createUser middleware', message: { err: err.message } });
  }
};

// Login user
userController.loginUser = async (req, res) => {
  const { idToken } = req.body; // Get idToken from the request body
  console.log('in login middleware', req.body);
  if (!idToken) {
    return res.status(400).json({ message: 'Missing ID token' });
  }

  try {
    // Verify the ID token
    console.log('Verifying ID token...');
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    console.log('Decoded token:', decodedToken);
    console.log('UID:', uid);

    // Check if email is verified
    if (!decodedToken.email_verified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

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

    console.log('Successfully logged in');
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

    // Optionally, delete user data from Firestore
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
