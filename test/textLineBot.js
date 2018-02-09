// testLineBot.js
const {expect} = require('chai');
const ChatMessage = require('../lib/chatbot/chatmessage');
const ResponseMessage = require('../lib/chatbot/responseMessage');
const LineBot = require('../lib/line/linebot');
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
