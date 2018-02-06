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

  })


});


describe('getUserByLineId()', () => {
  it('should find me a user', () => {
    let result = userDao.getUserByLineId("sss line");

    return Promise.all([
        expect(result).to.eventually.have.property('name').that.is.equal('Waka'),
        expect(result).to.eventually.have.property('lineProfile').that.have.property('userId').that.is.equal('sss line')
      ]
    );
  });

  it('should return a false', () => {
    let result = userDao.getUserByLineId("ssss");
    return expect(result).to.eventually.equal(false);
  });
});




