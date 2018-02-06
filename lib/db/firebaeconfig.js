// firebaseconfig.js
'use strict';

// require dotenv config.
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

function firebaseConfigFactory() {
  return {
    projectId: process.env.FIREBASE_PROJ_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  }
}


module.exports = firebaseConfigFactory();