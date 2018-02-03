// testLineBot.js
const {expect} = require('chai');
const ChatMessage = require('../lib/chatbot/chatmessage');
const LineBot = require('../lib/line/linebot');
const lineBot = new LineBot();

describe('convertToLineMessage()', function () {
  it('should convert a ChatMessage to a LineMessage', function () {

    // 1. ARRANGE
    let typeStr = 'text';
    let contextStr = '123456';
    let chatMsg = new ChatMessage(typeStr, contextStr);

    // 2. ACT
    let lineMessage = lineBot.convertToLineMessage(chatMsg);


    // 3. ASSERT
    expect(lineMessage.type).to.be.equal(typeStr);
    expect(lineMessage.text).to.be.equal(contextStr);

  });

});


describe('pushMessage()', () => {

  it('should push a line message', () => {

    // 1. Arrange arguments
    let typeStr = 'text';
    let contextStr = '123456';
    let chatMsg = new ChatMessage(typeStr, contextStr);


    // 2. act
    lineBot.pushMessage("0", [chatMsg]);

  });

});
