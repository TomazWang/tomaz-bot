// test button context
import {
  BUTTON_ACTION_TYPE_MESSAGE,
  BUTTON_ACTION_TYPE_POST,
} from '../lib/chatbot/messages/buttonContext';

const { expect } = require('chai');
const { createButtonAction } = require('../lib/chatbot/messages/buttonContext');

describe('testing chatbot/messages/buttonContext.js', () => {
  describe('createButtonAction()', () => {
    it('should create a button action with type as input', () => {
      // ARRANGE DATA
      const type = BUTTON_ACTION_TYPE_MESSAGE;
      const label = 'LABEL';
      const text = 'text'; // text must be provided when type = message

      // ACT
      const btnAction = createButtonAction({
        label,
        type,
        text,
      });

      // ASSERT
      expect(btnAction).to.have.property('type').that.is.equal(type);
    });

    it('should create a button action with action name as input', () => {
      // ARRANGE DATA
      const actionName = 'action name';
      const type = BUTTON_ACTION_TYPE_MESSAGE;
      const label = 'LABEL';
      const text = 'text'; // text must be provided when type = message

      // ACT
      const btnAction = createButtonAction({
        type,
        label,
        text,
        actionName,
      });

      // ASSERT
      expect(btnAction)
        .to
        .have
        .property('actionName')
        .that
        .is
        .equal(actionName);
    });

    it('should create a button action with text as input', () => {
      // ARRANGE DATA
      const type = BUTTON_ACTION_TYPE_MESSAGE;
      const label = 'LABEL'; // label must be provided.
      const text = 'some random text';

      // ACT
      const btnAction = createButtonAction({
        type,
        label,
        text,
      });

      // ASSERT
      expect(btnAction).to.have.property('text').that.is.equal(text);
    });

    it('should create a button action with label as input', () => {
      // ARRANGE DATA
      const actionLabel = 'action label';
      const type = BUTTON_ACTION_TYPE_MESSAGE;
      const text = 'some random text';

      // ACT
      const btnAction = createButtonAction({
        type,
        text,
        label: actionLabel,
      });
      // ASSERT
      expect(btnAction).to.have.property('label').that.is.equal(actionLabel);
    });

    it('should create a button action with data as input', () => {
      // ARRANGE DATA
      const type = BUTTON_ACTION_TYPE_POST;
      const label = 'LABEL'; // label must be provided.
      const datas = {
        name: 'Tom',
        id: 1233,
      };

      // ACT
      const btnAction = createButtonAction({
        type,
        label,
        datas,
      });
      // ASSERT
      expect(btnAction).to.have.property('datas');
      expect(btnAction).to.have.property('datas').that.is.equal(datas);
    });

    it('should reject label over 20 chars.', () => {
      // ARRANGE DATA
      const type = BUTTON_ACTION_TYPE_POST;
      const longLabel = 'qwertyuioasdfghjkxcvbnmwertyuiosdfghjk';

      expect(() => {
        createButtonAction({
          type,
          label: longLabel,
        });
      }).to.throw();
    });


    it('should throw when type was not provided', () => {
      // ARRANGE DATA
      expect(createButtonAction).to.throw();
    });
  });

  describe('createButtonContext()', () => {
    // TODO: @tomaz 11/02/2018: finish this test
  });
});

