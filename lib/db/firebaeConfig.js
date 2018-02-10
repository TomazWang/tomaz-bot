// firebaseconfig.js

// require dotenv config.
require('dotenv').config();

function firebaseConfigFactory() {
  return {
    projectId: process.env.FIREBASE_PROJ_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  };
}

module.exports = firebaseConfigFactory();
