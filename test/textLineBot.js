// testLineBot.js
const {expect} = require('chai');
const ChatMessage = require('../lib/chatbot/ChatMessage');
const ResponseMessage = require('../lib/chatbot/ResponseMessage');
const LineBot = require('../lib/line/LineBot');
const lineBot = new LineBot();


describe('test convertToLineMessage()', function () {
  it('should convert a response message to a line message', function () {
    // ARRANGE
    const desStr = "";
    const typeStr = "text";
    const contextStr = "123456";

    const resMsg = new ResponseMessage(desStr, typeStr, contextStr);

    // ACT
    const lineMessge = lineBot.convertToLineMessage(resMsg);


    // 3. ASSERT
    expect(lineMessge.type).to.be.equal(typeStr);
    expect(lineMessge.text).to.be.equal(contextStr);

  });


});
