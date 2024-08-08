const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://sightonscene-a87ca.firebaseio.com',
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = { auth, db, storage, admin };
