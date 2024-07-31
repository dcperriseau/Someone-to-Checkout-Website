const dotenv = require('dotenv');
const admin = require('firebase-admin');

// Load environment variables from .env file
dotenv.config();

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} catch (error) {
  console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error);
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();

module.exports = { auth, db, storage };
