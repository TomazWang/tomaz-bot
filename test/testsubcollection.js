// testsubcollection.js

const userDao = require('../lib/db/user/userDao');
const User = require('../lib/db/user/User');
const LineProfile = require('../lib/db/user/LineProfile');

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const admin = require("firebase-admin");
const db = admin.firestore();


describe('basic firestore ussage', () => {

  it('should add a data in collection \'sandbox\'', () => {
    let basicTestRef = db.collection('sandbox').doc('basic_test');
    basicTestRef.set({});
  });

});

describe('add sub collection', () => {

  it('should add a collection under a doc', () => {
    let someRef = db.collection('sandbox').doc('sub_collection_root').collection('sub_collection').doc('somthing');
    someRef.set({
      name: 'hi'
    });
  });


  it('should get a sub collection', () => {
    let someRef = db.collection('sandbox/sub_collection_root/sub_collection').doc('somthing');
    let result = someRef.get().then(snap => {
      return snap.data()
    });
    return expect(result).to.eventually.have.property('name').that.is.equal('hi');
  });

  it('should work', () => {
    if (process.env.NODE_ENV !== 'production') require('dotenv').config();
    let plateform = process.env.FIREBASE_PLATEFORM;

    function getRootRef() {
      return db.collection('plateforms').doc(plateform);
    }

    getRootRef().collection('sandbox').doc('sb1').set({});
  })


});