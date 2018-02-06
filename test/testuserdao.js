// testuserdao.js

const {expect} = require('chai');
const userdao = require('../lib/db/user/userdao');
const User = require('../lib/db/user/user');


describe('addUser()', () => {
  it('should convert a ChatMessage to a LineMessage', () => {

    // ARRANGE
    let user = new User("John");
    user.name = "Waka";
    user.lineId = "ssss line";

    // ACT
    userdao.addUser(user);

    // ASSERT

  })


});


describe('getUserByLineId()', () => {
  it('should convert a ChatMessage to a LineMessage', () => {

    userdao.getUserByLineId("ssss line").then(user => {
      expect(user.lineId).to.be('ssss line');
      expect(user.name).to.be('waka');
    });


  })


});



