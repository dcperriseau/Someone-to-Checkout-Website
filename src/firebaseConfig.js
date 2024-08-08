const functions = require('firebase-functions');
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountKeyPath = functions.config().custom.service_account_key_path;
const serviceAccount = JSON.parse(fs.readFileSync(path.resolve(__dirname, serviceAccountKeyPath), 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sightonscene-a87ca.firebaseio.com" 
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
