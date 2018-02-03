/**
 * @class
 * @type {module.Action}
 */
module.exports = class Action {
  constructor(chatMessage, action) {
    this._chatMessage = chatMessage;
    this._action = action;
    this._speech = "";
    this._needFollowUp = false;
  }

  get chatMessage() {
    return this._chatMessage;
  }

  get action() {
    return this._action;
  }

  get speech() {
    return this._speech;
  }

  set speech(value) {
    this._speech = value;
  }

  get needFollowUp() {
    return this._needFollowUp;
  }


  set needFollowUp(value) {
    this._needFollowUp = value;
  }
};