/**
 * @class
 * @type {module.Action}
 */
module.exports = class Action {
  constructor(chatMessage, action) {
    this.chatMessage = chatMessage;
    this.actionName = action;
    this.speech = '';
    this.needFollowUp = false;
    this.extra = {};
  }
};
