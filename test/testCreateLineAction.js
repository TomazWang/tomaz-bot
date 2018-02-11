const { expect } = require('chai');
const { createPostbackAction } = require('../lib/line/lineAction');


describe('test line/lineAction.js', () => {
  describe('createPostbackAction()', () => {
    it('should create action with type = post back', () => {
      // ARRANGE DATA
      const label = 'label';
      const name = 'actionName';


      // ACT
      const lineActon = createPostbackAction(label, '', name);

      // ASSERT
      expect(lineActon).to.have.property('type').that.is.equal('postback');
      expect(lineActon).to.have.property('data').that.is.equal(`action=${name}`);
    });


    it('should create action with data', () => {
      // ARRANGE DATA
      const label = 'label';
      const name = 'actionName';

      const datas = {
        name: 'someName',
        petName: 'pet no 1',
      };

      // ACT
      const lineActon = createPostbackAction(label, '', name, datas);

      // ASSERT
      expect(lineActon)
        .to
        .have
        .property('data')
        .that
        .is
        .equal('action=actionName&name=someName&petName=pet no 1');
    });
  });
});
