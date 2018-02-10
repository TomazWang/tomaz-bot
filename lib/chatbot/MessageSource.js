/**
 * The source of a line message
 * @class
 * @type {module.MessageSource}
 */
module.exports = class MessageSource {
  constructor(platform, type, from, speaker) {
    this.platform = platform;
    this.type = type;
    this.from = from;
    this.speaker = speaker;
  }
};
