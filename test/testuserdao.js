// testuserdao.js

const {expect} = require('chai');
const userDao = require('../lib/db/user/userdao');
const User = require('../lib/db/user/user');
const LineProfile = require('../lib/db/user/lineprofile');


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

    userDao.getUserByLineId("ssss line").then(user => {
      expect(user.lineId).to.be('ssss line');
      expect(user.name).to.be('waka');
    });
  });

  it('should return a false', () => {
    userDao.getUserByLineId("ssss").then(user => {
      expect(user).to.be(false);
    });
  });
});




