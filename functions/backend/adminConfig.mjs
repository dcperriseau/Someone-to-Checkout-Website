import admin from 'firebase-admin';
//import dotenv from 'dotenv';
import 'dotenv/config';

// Load environment variables from .env file
//dotenv.config();
// const config = JSON.parse(process.env.CLOUD_RUNTIME_CONFIG);
// const logger = config.customconfig.firebase_service_account_key;

// const serviceAccount = {
//   type: logger.type, //FIREBASE_TYPE
//   project_id: logger.project_id, //FIREBASE_PROJECT_ID 
//   private_key_id: logger.private_key_id, //FIREBASE_PRIVATE_KEY_ID
//   private_key: logger.private_key.replace(/\\n/g, '\n'), //FIREBASE_PRIVATE_KEY
//   client_email: logger.client_email, //FIREBASE_CLIENT_EMIAL
//   client_id: logger.client_id, //FIREBASE_CLIENT_ID
//   auth_uri: logger.auth_uri, //FIREBASE_AUTH_URI
//   token_uri: logger.token_uri,//FIREBASE_TOKEN _URI
//   auth_provider_x509_cert_url: logger.auth_provider_x509_cert_url,//FIREBASE_CERT_URL
//   client_x509_cert_url: logger.client_x509_cert_url,
//   universe_domain: logger.universe_domain,
// };

// console.log('process.env', process.env)
// console.log("PRIVATE KEY", serviceAccount.private_key);

// console.log('Service Account:', serviceAccount);

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const serviceAccount = require('../serviceAccountKey.json')


// Initialize Firebase Admin SDK
try {
  // Attempt to initialize Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

// Initialize services
const auth = admin.auth();
console.log('Auth service initialized');
const db = admin.firestore();
console.log('database: ', db);
const storage = admin.storage();
console.log('Storage service initialized');

// Confirm Firestore and Auth initialization
try {
  await db.collection('test').doc('testDoc').get();
  console.log('Firestore connection successful.');
} catch (error) {
  console.error('Error connecting to Firestore:', error);
}

//try {
 // await auth.getUser('testUserId');
 // console.log('Auth service connection successful.');
//} catch (error) {
 // console.error('Error connecting to Auth service:', error);
//}

export { auth, db, storage };
