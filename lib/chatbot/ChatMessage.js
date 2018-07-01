/**
 *
 * @type {module.ChatMessage}
 * @class
 */
module.exports = class ChatMessage {
  /**
   * Create a ChatMessage obj.
   * @param {module.MessageSource} source the source of the message
   * @param {string} type type of this chat message. ['text', 'image'... ]
   * @param {*} context general context.
   * @constructor
   */
  constructor(source, type, context) {
    this.context = context;
    this.type = type;
    this.source = source;
  }


  get speaker() {
    return this.source.speaker;
  }

  get from() {
    return this.source.from;
  }

  get fromPlatform() {
    return this.source.platform;
  }
};
