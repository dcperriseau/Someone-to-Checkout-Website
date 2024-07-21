const dotenv = require('dotenv');
const admin = require('firebase-admin'); // Use firebase-admin for admin tasks

// Load environment variables from .env file
dotenv.config();

// Parse the JSON content from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();

module.exports = { auth, db, storage };


const { getFirestore, collection, getDocs, doc, updateDoc, writeBatch, deleteField } = require("firebase/firestore");
const { getAuth } = require("firebase/auth");
const { getStorage } = require('firebase/storage');



// async function deleteFieldFromCollection() {
  //   const collectionRef = collection(db, 'users');
  //   const snapshot = await getDocs(collectionRef);
  //   const batch = writeBatch(db);
  
  //   snapshot.forEach((document) => {
    //     const docRef = doc(db, 'users', document.id);
    //     batch.update(docRef, {
      //       paypalId: deleteField(),
      //       imageUrl: deleteField(),
      //       wallet: deleteField(),
      //       paypal: deleteField(),
      //     });
      //   });
      
      //   try {
        //     await batch.commit();
        //     console.log('Fields deleted from all documents successfully.');
        //   } catch (error) {
          //     console.error('Error deleting fields: ', error);
          //   }
          // }
          // deleteFieldFromCollection();