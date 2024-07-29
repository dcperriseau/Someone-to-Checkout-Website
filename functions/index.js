const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.getListings = functions.https.onRequest(async (req, res) => {
  try {
    const snapshot = await db.collection("property_listings").get();
    const listings = snapshot.docs.map((doc) => doc.data());
    res.status(200).json({listings});
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).send("Internal Server Error");
  }
});
