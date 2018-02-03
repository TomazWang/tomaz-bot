/**
 *
 * @type {module.ChatMessage}
 * @class
 */
module.exports = class ChatMessage {

  /**
   * Create a ChatMessage obj.
   * @param {module.MessageSource} source the source of the message
   * @param {string} type type of this chat message.
   * @param {*} context general context.
   * @constructor
   */
  constructor(source, type, context) {
    this._context = context;
    this._type = type;
    this._source = source;
  }

  /**
   * @returns {string}
   */
  get type() {
    return this._type;
  }

  /**
   * @returns {*}
   */
  get context() {
    return this._context;
  }

  /**
   * @returns {module.MessageSource}
   */
  get source() {
    return this._source;
  }
};