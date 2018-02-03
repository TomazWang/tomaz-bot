'use strict';

const request = require('request');
const logger = require('../../logger');
const ChatMessage = require('../chatbot/chatmessage');


/**
 *
 * Line Bot
 * @type {module.LineBot}
 * @class
 */
module.exports = class LineBot {


  /**
   * @param config {lineConfig}
   * @constructor
   */
  constructor(config) {
    this._config = config;
    this._sendMessageInterval = 500;
  }


  get config() {
    return this._config;
  }


  /**
   * Processes line message.
   *
   * The message object should be like
   *
   * 'message': {
   *    'id': '325708',
   *    'type': 'text',
   *    'text': 'Hello, world'
   *  }
   *
   * @param sourceId
   * @param message
   *
   * @private
   */
  _processMessageEvent(sourceId, message) {

    let messageType = message.type;

    if (messageType === 'text') {
      // push it back just for test


      // do an echo for test
      let msgText = message.text;
      let msg = new ChatMessage('text', msgText);

      this.pushMessage(sourceId, [msg]);

    }

  }


  /**
   * Get the source of the Line event.
   * @param event Line event
   * @return {string} the source id of this event.
   *
   * @private
   *
   */
  _getSourceId(event) {
    if (event.source) {

      if (event.source.type === 'user') {
        return event.source.userId;
      }

      if (event.source.type === 'group') {
        return event.source.groupId;
      }

      if (event.source.type === 'room') {
        return event.source.roomId;
      }
    }
    return '';
  }


  /**
   *
   * Process a line event.
   *
   * Event body is look like this:
   *
   * {
   *     'replyToken': '...',
   *     'type': 'message',
   *     'timestamp': 1462629479859,
   *     'source': {
   *         'type': 'user',
   *         'userId': 'U4af4980629...'
   *     },
   *     'message': {
   *         'id': '325708',
   *         'type': 'text',
   *         'text': 'Hello, world'
   *     }
   * }
   *
   * @param event
   */
  processLineEvent(event) {
    logger.debug('processLineEvent: start');

    const sourceId = this._getSourceId(event);
    logger.debug(`processLineEvent: source id = ${sourceId}`);

    //
    // Line message api event type:
    //   - message
    //   - postback
    //   - follow / unfollow
    //   - join / leave
    //   - beacon
    const type = event.type;
    logger.debug(`processLineEvent: event type = ${type}`);


    if (type === 'message') {
      this._processMessageEvent(sourceId, event.message);
    }


    if (type === 'postback') {
      // TODO: @tomaz 30/01/2018: finish postback
    }

  }


  /**
   *
   * @param receiverId
   * @param chatMessages {array} an array of chatMessage.
   */
  pushMessage(receiverId, chatMessages) {

    let lineMessages = chatMessages.map((cm) => {
      return this.convertToLineMessage(cm);
    });

    Promise.resolve(lineMessages.map(lm => this.convertToLineMessage(lm)))
      .then(() => this._pushLineMessage(receiverId, lineMessages))
      .then(() => this.sleep(this._sendMessageInterval))
      .catch(() => { /* do error handling later */
      });

  }


  /**
   *
   * Push message to line server.
   *
   * @param receiverId
   * @param lineMessages {array} an array of line message.
   * @returns {Promise<any>}
   */
  _pushLineMessage(receiverId, lineMessages) {
    logger.debug('_pushLineMessage: called');
    return new Promise((resolve, reject) => {

      request.post('https://api.line.me/v2/bot/message/push', {
        forever: true,
        headers: {
          'Authorization': `Bearer ${this.config.channelAccessToken}`
        },
        json: {
          to: receiverId,
          messages: lineMessages
        }
      }, (error, response, body) => {
        if (error) {
          logger.error('_pushLineMessage: Error while sending message', error);
          reject(error);
          return;
        }

        if (response.statusCode !== 200) {
          logger.error('_pushLineMessage: Error status code while sending message', body);
          reject(error);
          return;
        }

        logger.debug('_pushLineMessage: Send message succeeded');
        logger.debug(`_pushLineMessage: ${body}`);
        resolve(body);
      });
    });

  }


  /**
   * @param chatMessage {module.ChatMessage} an array of ChatMessages
   * @return {Object} [{type:string, text:string}]
   */
  convertToLineMessage(chatMessage) {

    let type = chatMessage.type;
    let context = chatMessage.context;

    switch (type) {
      case 'text':
        // text message
        return {
          type: type,
          text: context
        };
      default:
        break;
    }


  }

  sleep(delay) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), delay);
    });
  }

};




