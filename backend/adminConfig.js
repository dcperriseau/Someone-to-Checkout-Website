import admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

console.log('Service Account:', serviceAccount);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize services
const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();

// Confirm Firestore and Auth initialization
try {
  await db.collection('test').doc('testDoc').get();
  console.log('Firestore connection successful.');
} catch (error) {
  console.error('Error connecting to Firestore:', error);
}

try {
  await auth.getUser('testUserId');
  console.log('Auth service connection successful.');
} catch (error) {
  console.error('Error connecting to Auth service:', error);
}

export { auth, db, storage };
