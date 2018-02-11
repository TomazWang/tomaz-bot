export const RES_MSG_TYPE_TEXT = 'text';
export const RES_MSG_TYPE_BUTTON = 'buttons';

/**
 *
 * @type {module.ResponseMessage}
 * @class
 */
export class ResponseMessage {
  /**
   * Create a ResponseMessage obj.
   * @param {module.Destination} des where will this message send to.
   * @param {string} type type of this chat message.
   *      [{@link RES_MSG_TYPE_TEXT}, {@link RES_MSG_TYPE_BUTTON}]
   * @param {*} context general context.
   * @constructor
   */
  constructor(des, type, context) {
    this.context = context;
    this.type = type;
    this.des = des;
  }
}
