const { createButton, createThumbnail } = require('../lib/line/lineTempButton');
const { createMessageAction } = require('../lib/line/lineAction');
const { expect } = require('chai');

describe('createThumbnail()', () => {
  it('should create a thumbnail', () => {
    // ARRANGE
    const url = 'some-url';

    // ACT
    const thumbnail = createThumbnail(url);

    // ASSERT
    expect(thumbnail).to.have.property('thumbnailImageUrl').that.is.equal(url);
  });

  it('should create a thumbnail with default size', () => {
    // ARRANGE
    const url = 'some-url';

    // ACT
    const thumbnail = createThumbnail(url);

    // ASSERT
    expect(thumbnail).to.have.property('imageAspectRatio').that.is.equal('rectangle');
    expect(thumbnail).to.have.property('imageSize').that.is.equal('cover');
  });
});

describe('createButton()', () => {
  it('should create a template that has type = button', () => {
    // 1. ARRANGE DATA
    const action = createMessageAction('label', 'text');

    // 2. ACT
    const btn = createButton('message', [action]);

    // 3. ASSERT
    expect(btn).to.have.property('type').that.is.equal('buttons');
  });

  it('should create a template that contains message', () => {
    // 1. ARRANGE DATA
    const action = createMessageAction('label', 'text');

    // 2. ACT
    const btn = createButton('message', [action]);

    // 3. ASSERT
    expect(btn).to.have.property('text').that.is.equal('message');
  });

  it('should create a template that contains only one action', () => {
    // 1. ARRANGE DATA
    const action = createMessageAction('label', 'text');

    // 2. ACT
    const btn = createButton('message', [action]);

    // 3. ASSERT
    expect(btn).to.have.property('actions').that.have.lengthOf(1);
  });

  it('should create a template that contains only multiple action', () => {
    // 1. ARRANGE DATA
    const action1 = createMessageAction('label1', 'text1');
    const action2 = createMessageAction('label2', 'text2');


    // 2. ACT
    const btn = createButton('message', [action1, action2]);

    // 3. ASSERT
    expect(btn).to.have.property('actions').that.have.lengthOf(2);
  });

});

