import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const config = JSON.parse(process.env.CLOUD_RUNTIME_CONFIG);
const logger = config.customconfig.firebase_service_account_key;

console.log("firebaseConfig", logger);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: logger.api_key,
  authDomain: logger.auth_domain,
  projectId: logger.project_id,
  storageBucket: logger.storage_bucket,
  messagingSenderId: logger.messaging_sender_id,
  appId: logger.app_id,
  //measurementId: logger.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase 
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const getFirebaseApp = () => app;

// Set persistence to local
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistence set to local');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

// Export the services and Firebase app instance
export { auth, db, storage, app, getFirebaseApp };
