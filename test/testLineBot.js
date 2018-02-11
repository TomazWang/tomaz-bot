// testLineBot.js
const { expect } = require('chai');
const ResponseMessage = require('../lib/chatbot/messages/ResponseMessage');
const LineBot = require('../lib/line/LineBot');
const { createButtonContext, createButtonAction } = require('../lib/chatbot/messages/buttonContext');

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


describe('convertResMsgToBtnTemp()', () => {
  it('should convert button context to line button template', () => {
    // ARRANGE DATA
    const actionType = 'post';
    const actionName = 'actionName';
    const acitonLable = 'label';
    const text = 'some text';

    const btnAction = createButtonAction({
      type: actionType,
      actionName,
      label: acitonLable,
      text
    });

    const btnContext = createButtonContext({
      message: 'description',
      buttonActions: btnAction,
    });

    const resMsg = new ResponseMessage('', 'button', btnContext);

    // ACT
    const tempMsg = LineBot.convertResMsgToBtnTemp(resMsg);


    // ASSERT
    expect(tempMsg).to.have.property('type').that.is.equal('template');
  });
});
