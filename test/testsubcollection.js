// testsubcollection.js
require('dotenv').config();

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const config = require('../lib/db/firebaeConfig');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(config),
    databaseURL: 'https://tomaz-bot.firebaseio.com',
  });
}


const db = admin.firestore();

describe('basic firestore ussage', () => {
  it('should add a data in collection \'sandbox\'', () => {
    const basicTestRef = db.collection('sandbox').doc('basic_test');
    basicTestRef.set({});
  });
});

describe('add sub collection', () => {
  it('should add a collection under a doc', () => {
    const someRef = db.collection('sandbox').doc('sub_collection_root').collection('sub_collection').doc('somthing');
    someRef.set({
      name: 'hi',
    });
  });

  it('should work', () => {
    const plateform = process.env.FIREBASE_PLATEFORM;

    function getRootRef() {
      return db.collection('plateforms').doc(plateform);
    }

    getRootRef().collection('sandbox').doc('sb1').set({});
  });
});
