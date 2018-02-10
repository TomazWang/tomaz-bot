// dbroot.js
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const admin = require("firebase-admin");
const config = require("./firebaeConfig");

admin.initializeApp({
  credential: admin.credential.cert(config),
  databaseURL: "https://tomaz-bot.firebaseio.com"
});

const db = admin.firestore();

let plateform = process.env.FIREBASE_PLATEFORM;

function getRootRef() {
  return db.collection('plateforms').doc(plateform);
}

module.exports.dbRootRef = getRootRef();