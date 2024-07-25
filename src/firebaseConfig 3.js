const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');
const { getStorage } = require('firebase/storage');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzDljTmYAC6Uue5iBsaKKUg-V2iuyd910",
  authDomain: "sightonscene-a87ca.firebaseapp.com",
  projectId: "sightonscene-a87ca",
  storageBucket: "sightonscene-a87ca.appspot.com",
  messagingSenderId: "1074561935073",
  appId: "1:1074561935073:web:366ef88ce7ba244c6f79a0",
  measurementId: "G-PHD0QKDG0H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

module.exports = { auth, db, storage };
