const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

require('dotenv').config(); 

const serviceAccountKeyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;
const serviceAccount = JSON.parse(fs.readFileSync(path.resolve(__dirname, serviceAccountKeyPath), 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sightonscene-a87ca.firebaseio.com"    
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
