/**
 * The source of a line message
 * @class
 * @type {module.MessageSource}
 */
module.exports = class MessageSource {

  constructor(platform, type, from, speaker) {
    this._platform = platform;
    this._type = type;
    this._from = from;
    this._speaker = speaker;
  }

  get type() {
    return this._type;
  }

  get from() {
    return this._from;
  }

  get speaker() {
    return this._speaker;
  }

  get platform() {
    return this._platform;
  }
};