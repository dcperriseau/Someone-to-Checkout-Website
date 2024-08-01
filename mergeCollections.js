const { Firestore } = require('@google-cloud/firestore');
const path = require('path');
const fs = require('fs');

// Path to the service account key file
const serviceAccountPath = path.resolve(__dirname, 'service_account_key.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Service account key file not found:', serviceAccountPath);
  process.exit(1);
}

const firestore = new Firestore({
  keyFilename: serviceAccountPath,
});

async function mergeCollections() {
  const oldCollectionRef = firestore.collection('listings');
  const newCollectionRef = firestore.collection('property_listings');

  try {
    const snapshot = await oldCollectionRef.get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }

    const batch = firestore.batch();

    snapshot.forEach(doc => {
      const data = doc.data();
      const newDocRef = newCollectionRef.doc(doc.id);
      batch.set(newDocRef, data);
    });

    await batch.commit();
    console.log('Documents successfully merged to "property_listings" collection.');

    // Optional: Delete documents from the old collection
    // const deleteBatch = firestore.batch();
    // snapshot.forEach(doc => {
    //   const oldDocRef = oldCollectionRef.doc(doc.id);
    //   deleteBatch.delete(oldDocRef);
    // });
    // await deleteBatch.commit();
    // console.log('Documents successfully deleted from "listings" collection.');

  } catch (error) {
    console.error('Error merging collections:', error);
  }
}

mergeCollections();
