/**
 *
 * @type {module.ResponseMessage}
 * @class
 */
module.exports = class ResponseMessage {

  /**
   * Create a ResponseMessage obj.
   * @param {module.Destination} des where will this message send to.
   * @param {string} type type of this chat message.
   * @param {*} context general context.
   * @constructor
   */
  constructor(des, type, context) {
    this._context = context;
    this._type = type;
    this._des = des;
  }

  /**
   * @returns {string} ['text', 'image']
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
   * @returns {module.Destination|*}
   */
  get des() {
    return this._des;
  }
};