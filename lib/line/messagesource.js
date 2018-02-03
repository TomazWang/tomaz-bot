/**
 * The source of a line message
 * @class
 * @type {module.MessageSource}
 */
module.exports = class MessageSource {

  constructor(type, from, speaker) {
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

  /**
   * @param lineEvent
   * @returns {module.MessageSource}
   */
  static getSource(lineEvent) {
    if (lineEvent.source) {

      let userId = lineEvent.source.userId;

      if (lineEvent.source.type === 'user') {
        return new MessageSource('user', userId, userId);
      }

      if (lineEvent.source.type === 'group') {
        let groudId = lineEvent.source.groupId;
        return new MessageSource('group', groudId, userId);
      }

      if (lineEvent.source.type === 'room') {
        let roomId = lineEvent.source.roomId;
        return new MessageSource('room', roomId, userId);
      }
    }

    return new MessageSource();
  }

};