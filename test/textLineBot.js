// testLineBot.js
const { expect } = require('chai');
const ResponseMessage = require('../lib/chatbot/ResponseMessage');
const LineBot = require('../lib/line/LineBot');

describe('test convertToLineMessage()', () => {
  it('should convert a response message to a line message', () => {
    // ARRANGE
    const desStr = '';
    const typeStr = 'text';
    const contextStr = '123456';

    const resMsg = new ResponseMessage(desStr, typeStr, contextStr);

    // ACT
    const lineMessge = LineBot.convertToLineMessage(resMsg);


    // 3. ASSERT
    expect(lineMessge.type).to.be.equal(typeStr);
    expect(lineMessge.text).to.be.equal(contextStr);
  });
});
