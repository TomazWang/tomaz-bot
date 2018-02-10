/**
 *
 * @type {module.ResponseMessage}
 * @class
 */
module.exports = class ResponseMessage {
  /**
   * Create a ResponseMessage obj.
   * @param {module.Destination} des where will this message send to.
   * @param {string} type type of this chat message. ['text', 'image']
   * @param {*} context general context.
   * @constructor
   */
  constructor(des, type, context) {
    this.context = context;
    this.type = type;
    this.des = des;
  }
};
