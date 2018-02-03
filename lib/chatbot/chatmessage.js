/**
 *
 * @type {module.ChatMessage}
 * @class
 */
module.exports = class ChatMessage {

  /**
   * Create a ChatMessage obj.
   * @param {string} type type of this chat message.
   * @param context general context.
   * @constructor
   */
  constructor(type, context) {
    this._context = context;
    this._type = type;
  }

  /**
   * @returns {string}
   */
  get type() {
    return this._type;
  }

  get context() {
    return this._context;
  }


};