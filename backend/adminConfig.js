const dotenv = require('dotenv');
const admin = require('firebase-admin'); // Use firebase-admin for admin tasks

// Load environment variables from .env file
dotenv.config();

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not defined');
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();

module.exports = { auth, db, storage };
