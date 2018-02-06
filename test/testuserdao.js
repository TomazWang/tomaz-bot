// testuserdao.js

const userDao = require('../lib/db/user/userdao');
const User = require('../lib/db/user/user');
const LineProfile = require('../lib/db/user/lineprofile');

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const admin = require("firebase-admin");
const config = require("../lib/db/firebaeconfig");
const db = admin.firestore();


// get data
describe('queryUser', () => {

  it('should get me a user', () => {

    db.collection('users').get()
      .then(snap => {
        if (snap && !snap.empty) {
          console.log("got");
          snap.forEach(doc => {
            console.log(doc.data());
            return doc.data();
          })
        } else {
          console.log("no result");
          return Promise.resolve(false)
        }
      });


  });


});


describe('addUser()', () => {
  it('should add a user to firestore', () => {

    // ARRANGE
    let user = new User("John");
    user.name = "Waka";
    user.lineProfile = new LineProfile("sss line");

    // ACT
    userDao.addUser(user);

    // ASSERT

  })


});


describe('getUserByLineId()', () => {
  it('should find me a user', () => {
    let result = userDao.getUserByLineId("sss line");

    expect(result.then(user => user.name)).to.eventually.equal('Waka');


    // expect(user.name).to.eventually.equal('waka');
    // expect(user.lineProfile.userId).to.eventually.equal('ssss line');
  });

  it('should return a false', () => {
    userDao.getUserByLineId("ssss").then(user => {
      expect(user).to.eventually.equal(false);
    });
  });
});




