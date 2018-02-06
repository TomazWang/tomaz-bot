const express = require('express');
const router = express.Router();

const admin = require("firebase-admin");

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJ_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  }),
  databaseURL: "https://tomaz-bot.firebaseio.com"
});

const db = admin.firestore();


/* GET home page. */
router.get('/', function (req, res, next) {

  db.collection('users').get()
    .then(snap => {
      snap.forEach((doc) => {
        res.send(`${doc.id} -> ${JSON.stringify(doc.data())}`);
      })
    }).catch(err => {
    console.log(err);
  })


});

module.exports = router;
