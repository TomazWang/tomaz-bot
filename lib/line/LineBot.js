const request = require('request');
const logger = require('../../logger');
const ChatMessage = require('../chatbot/ChatMessage');
const MessageSource = require('../chatbot/MessageSource');
const handleMessage = require('../chatbot/handleMessage');
const handleAction = require('../chatbot/action/handleAction');
const { createTempMsg } = require('../line/lineTempMsg');
const { createButton, createThumbnail } = require('../line/lineTempButton');
const { createMessageAction, createPostbackAction, createUriAction } = require('../line/lineAction');

/**
 * Get the source of the Line event.
 * @param event Line event
 * @return {module.MessageSource} the source of this event.
 *
 * @private
 *
 */
function getSource(event) {
  const { source } = event;
  if (source) {
    const { userId, type } = source;

    if (type === 'user') {
      return new MessageSource('line', 'user', userId, userId);
    }

    if (type === 'group') {
      const groudId = source.groupId;
      return new MessageSource('line', 'group', groudId, userId);
    }

    if (type === 'room') {
      const { roomId } = source;
      return new MessageSource('line', 'room', roomId, userId);
    }
  }

  return new MessageSource();
}

function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), delay);
  });
}

/**
 *
 * Line Bot
 * @type {module.LineBot}
 * @class
 */
module.exports = class LineBot {
  /**
   * @param config {{ channelSecret: string, channelAccessToken: string}}
   * @constructor
   */
  constructor(config) {
    this.config = config;
    this.sendMessageInterval = 500;
    this.name = '機器人';
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
    logger.debug('linebot.js#processLineEvent: start');

    const source = getSource(event);
    logger.debug(`linebot.js#processLineEvent: source = ${JSON.stringify(source)}`);

    //
    // Line message api event type:
    //   - message
    //   - postback
    //   - follow / unfollow
    //   - join / leave
    //   - beacon
    const { type } = event;
    logger.debug(`linebot.js#processLineEvent: event type = ${type}`);

    if (type === 'message') {
      this.processMessageEvent(source, event);
    }

    if (type === 'postback') {
      // TODO: @tomaz 30/01/2018: finish postback
    }
  }

  /**
   * @param resMessage {module.ResponseMessage} [an array of ResponseMessage]
   */
  static convertResMsgToBtnTemp(resMessage) {
    const { context } = resMessage;
    const {
      title, message, actions, thumbnailImageUrl,
    } = context;

    const lineActions = actions.map(({
      label, type, actionName, datas, text,
    }) => {
      if (type === 'post') {
        return createPostbackAction(label, actionName, datas);
      } else if (type === 'message') {
        return createMessageAction(label, text);
      } else if (type === 'uri') {
        return createUriAction(label, text);
      }
      return {};
    });

    const thumbnailInfo = createThumbnail(thumbnailImageUrl);
    const buttonTemp = createButton(message, lineActions, thumbnailInfo, title);
    return createTempMsg(message, buttonTemp);
  }

  /**
   * @param resMessage {module.ResponseMessage} [an array of RespnseMessage]
   * @return {Object} [{type:string, text:string}]
   */
  static convertToLineMessage(resMessage) {
    const { type, context } = resMessage;

    switch (type) {
      case 'text':
        // text message
        return {
          type,
          text: context,
        };

      case 'buttons':
        // button template
        return LineBot.convertResMsgToBtnTemp(resMessage);
      default:
        return {};
    }
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
  processMessageEvent(source, messageEvent) {
    logger.debug('linebot.js#processMessageEvent: start');

    const { message } = messageEvent;
    const messageType = message.type;

    if (messageType === 'text') {
      // convert line message to ChatMessage.

      logger.debug('linebot.js#processMessageEvent: handle text message');

      // do an echo for test
      const msgText = message.text;

      // create chat message base on it.
      const chatMsg = new ChatMessage(source, 'text', msgText);

      handleMessage(this.name, chatMsg).then((action) => {
        logger.debug('linebot.js#processMessageEvent: before handle action');
        if (action) {
          return handleAction(action);
        }
        logger.error(`linebot.js#_processMessageEvent: action ${action} no regonized`);
        return Promise.resolve(false);
      }).then((response) => {
        if (response) {
          this.pushMessage(response);
        }
      }).catch((err) => {
        logger.error(`linebot.js#: ${err}`);
      });
    }
  }

  /**
   *
   * Push message to line server.
   *
   * @param receiverId
   * @param lineMessages {array} an array of line message.
   * @returns {Promise<any>}
   */
  pushLineMessage(receiverId, lineMessages) {
    logger.debug('pushLineMessage: called');
    return new Promise((resolve, reject) => {
      const reqData = {
        forever: true,
        headers: {
          Authorization: `Bearer ${this.config.channelAccessToken}`,
        },
        json: {
          to: receiverId,
          messages: lineMessages,
        },
      };

      logger.debug(`linebot.js#_pushLineMessage: reqData = ${JSON.stringify(reqData)}`);

      request.post(
        'https://api.line.me/v2/bot/message/push', reqData,
        (error, response, body) => {
          if (error) {
            logger.error('pushLineMessage: Error while sending message', error);
            reject(error);
            return;
          }

          const { statusCode, body: resBody } = response;
          if (statusCode !== 200) {

            logger.error(`pushLineMessage: Error status code while sending message (code = ${statusCode})`);
            const { message, details } = resBody;
            reject(new Error(`Push line message error with code ${statusCode}, ${message}\n${JSON.stringify(details)}`), 'LineBot.js', 251);
            return;
          }

          logger.debug('pushLineMessage: Send message succeeded');
          logger.debug(`pushLineMessage: ${body}`);
          resolve(body);
        },
      );
    });
  }

  /**
   *
   * @param {module.ResponseMessage} responseMessage
   */
  pushMessage(responseMessage) {
    logger.debug('linebot.js#pushMessage: push message to line.');

    Promise.resolve(responseMessage)
      .then(rm => this.pushLineMessage(
        rm.des.to,
        [LineBot.convertToLineMessage(rm)],
      ))
      .then(() => sleep(this.sendMessageInterval))
      .catch((err) => {
        // handle error later
        logger.error(`linebot.js#: error occours ${err}`);
      });
  }
};

