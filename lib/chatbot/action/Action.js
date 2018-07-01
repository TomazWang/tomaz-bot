/**
 * @class
 * @type {module.Action}
 */
module.exports = class Action {
  /**
   * @param chatMessage {module.ChatMessage}
   * @param action {module.Action}
   */
  constructor(chatMessage, action) {
    this.chatMessage = chatMessage;
    this.actionName = action;
    this.speech = '';
    this.needFollowUp = false;
    this.extra = {};
  }
};
