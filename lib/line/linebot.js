'use strict';

const request = require('request');
const logger = require('../../logger');
const ChatMessage = require('../chatbot/chatmessage');
const MessageSource = require('../chatbot/messagesource');
const handleMessage = require('../chatbot/handlemessage');
const handleAction = require('../chatbot/handleaction');


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
    this._name = "機器人";
  }


  get config() {
    return this._config;
  }

  get name() {
    return this._name;
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
    logger.debug(`linebot.js#processLineEvent: start`);

    const source = this._getSource(event);
    logger.debug(`linebot.js#processLineEvent: source = ${JSON.stringify(source)}`);

    //
    // Line message api event type:
    //   - message
    //   - postback
    //   - follow / unfollow
    //   - join / leave
    //   - beacon
    const type = event.type;
    logger.debug(`linebot.js#processLineEvent: event type = ${type}`);


    if (type === 'message') {
      this._processMessageEvent(source, event);
    }


    if (type === 'postback') {
      // TODO: @tomaz 30/01/2018: finish postback
    }

  }


  /**
   *
   * @param {module.ResponseMessage} responseMessage
   */
  pushMessage(responseMessage) {
    logger.debug(`linebot.js#pushMessage: push message to line.`);

    Promise.resolve(responseMessage)
      .then(rm => this._pushLineMessage(rm.des.to, this.convertToLineMessage(rm)))
      .then(() => this.sleep(this._sendMessageInterval))
      .catch(err => {
        // handle error later
        logger.error(`linebot.js#: error occours ${err.message}`);
      });

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
   * @param source {module.MessageSource}
   * @param messageEvent a line message event
   *
   * @private
   */
  _processMessageEvent(source, messageEvent) {
    logger.debug(`linebot.js#_processMessageEvent: start`);

    let message = messageEvent.message;
    let messageType = message.type;

    if (messageType === 'text') {
      // convert line message to ChatMessage.

      logger.debug(`linebot.js#_processMessageEvent: handle text message`);

      // do an echo for test
      let msgText = message.text;

      // create chat message base on it.
      let chatMsg = new ChatMessage(source, 'text', msgText);

      Promise.resolve(chatMsg)
        .then(msg => {
          logger.debug(`linebot.js#_processMessageEvent: before handle msg`);
          return handleMessage(this.name, chatMsg);
        })
        .then(action => {
          logger.debug(`linebot.js#_processMessageEvent: before handle action`);
          if (action) {
            return handleAction(action);
          } else {
            logger.error(`linebot.js#_processMessageEvent: action ${action} no regonized`);
          }
        }).then(response => {
        if (response) {
          this.pushMessage(response);
        }
      }).catch(err => {
        logger.error(`linebot.js#: ${err}`);
      });

    }

  }


  /**
   * Get the source of the Line event.
   * @param event Line event
   * @return {module.MessageSource} the source of this event.
   *
   * @private
   *
   */
  _getSource(event) {
    if (event.source) {

      let userId = event.source.userId;

      if (event.source.type === 'user') {
        return new MessageSource('line', 'user', userId, userId);
      }

      if (event.source.type === 'group') {
        let groudId = event.source.groupId;
        return new MessageSource('line', 'group', groudId, userId);
      }

      if (event.source.type === 'room') {
        let roomId = event.source.roomId;
        return new MessageSource('line', 'room', roomId, userId);
      }
    }

    return new MessageSource();
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
   * @param resMessage {module.ResponseMessage} [an array of RespnseMessage]
   * @return {Object} [{type:string, text:string}]
   */
  convertToLineMessage(resMessage) {

    let type = resMessage.type;
    let context = resMessage.context;

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




