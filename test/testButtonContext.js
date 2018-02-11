// test button context
const { expect } = require('chai');
const { createButtonContext, createButtonAction } = require('../lib/chatbot/messages/buttonContext');


describe('testing chatbot/messages/buttonContext.js', () => {
  describe('createButtonAction()', () => {
    it('should create a button action with type as input', () => {
      // ARRANGE DATA
      const type = 'post';

      // ACT
      const btnAction = createButtonAction({ type });


      // ASSERT
      expect(btnAction).to.have.property('type').that.is.equal(type);
    });

    it('should create a button action with action name as input', () => {
      // ARRANGE DATA
      const actionName = 'action name';

      // ACT
      const btnAction = createButtonAction({ actionName });


      // ASSERT
      expect(btnAction).to.have.property('actionName').that.is.equal(actionName);
    });

    it('should create a button action with text as input', () => {
      // ARRANGE DATA
      const text = 'text';

      // ACT
      const btnAction = createButtonAction({ text });

      // ASSERT
      expect(btnAction).to.have.property('text').that.is.equal(text);
    });

    it('should create a button action with label as input', () => {
      // ARRANGE DATA
      const actionLabel = 'action label';

      // ACT
      const btnAction = createButtonAction({ label: actionLabel });
      // ASSERT
      expect(btnAction).to.have.property('label').that.is.equal(actionLabel);
    });


    it('should create a button action with data as input', () => {
      // ARRANGE DATA
      const datas = {
        name: 'Tom',
        id: 1233,
      };

      // ACT
      const btnAction = createButtonAction({ datas });
      // ASSERT
      expect(btnAction).to.have.property('datas');
      expect(btnAction).to.have.property('datas')
        .that.is.equal(datas);
    });
  });

  describe('createButtonContext()', () => {
    // TODO: @tomaz 11/02/2018: finish this test
  });

});

