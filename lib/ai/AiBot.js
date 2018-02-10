const apiai = require('apiai');
const uuid = require('uuid');
const aiConfig = require('./aiConfig');
const logger = require('../../logger');
const Action = require('../chatbot/action/Action');

const sessionIds = new Map();


/**
 * @param chatMessage
 * @return {string}
 * @private
 */
function getSesionIdFromChatMessage(chatMessage) {
  const chatId = chatMessage.source.from + chatMessage.source.speaker;

  if (!sessionIds.has(chatId)) {
    const sessionId = uuid.v4();
    sessionIds.set(chatId, sessionId);
    logger.debug(`aibot.js#processMessage: put uuid ${sessionId} into session id map.`);
  }

  return sessionIds.get(chatId);
}

function isDefined(obj) {
  if (typeof obj === 'undefined') {
    return false;
  }

  if (!obj) {
    return false;
  }

  return obj !== null;
}


/**
 * @param chatMessage {module.ChatMessage}
 * @param apiaiResponse
 * @return {module.Action|boolean}
 */
function processAiResponse(chatMessage, apiaiResponse) {
  logger.debug('aibot.js#processAiResponse: get some response');
  logger.debug(`aibot.js#_processAiResponse: ${JSON.stringify(apiaiResponse)}`);

  if (isDefined(apiaiResponse.result)) {
    const { result } = apiaiResponse;
    const actionName = result.action;
    const { actionIncomplete } = result;

    const responseText = result.fulfillment.speech;


    const action = new Action(chatMessage, actionName);
    action.needFollowUp = actionIncomplete;
    action.speech = responseText;
    action.extra.df_parameter = result.parameters;

    return action;
  }
  return false;
}

/**
 * @class
 * @type {module.AiBot}
 */
module.exports = class AiBot {
  constructor() {
    /**
     * {
        language?: string;
        hostname?: string;
        version?: string;
        endpoint?: string;
        requestSource?: string;
        secure?: boolean;
    }
     * @type {{language: *, requestSource: string}}
     */
    const apiaiOptions = {
      language: ' zh-TW',
    };


    this.apiaiService = apiai(aiConfig.clientAccessToken, apiaiOptions);
    this.sendMessageInterval = 500;
  }


  /**
   * @param chatMessage {module.ChatMessage}
   * @return {Promise<module.Action|boolean>}
   */
  processMessage(chatMessage) {
    logger.debug('aibot.js#processMessage: start process ');

    const messageText = chatMessage.context;
    const sessionId = getSesionIdFromChatMessage(chatMessage);

    const apiaiRequest = this.apiaiService.textRequest(messageText, {
      sessionId,
    });

    return new Promise(((resolve, reject) => {
      apiaiRequest.on('response', (response) => {
        resolve(processAiResponse(chatMessage, response));
      });

      apiaiRequest.on('error', (error) => {
        logger.error(error);
        reject(error);
      });

      apiaiRequest.end();
    }));
  }

  /**
   * @param chatMessage
   * @param event
   * @return {Promise<module.Action>}
   */
  processEvent(chatMessage, event) {
    logger.debug(`aibot.js#processEvent: sending event ${JSON.stringify(event)}`);

    const apiaiRequest = this.apiaiService.eventRequest(event, {
      sessionId: getSesionIdFromChatMessage(chatMessage),
    });

    return new Promise(((resolve, reject) => {
      apiaiRequest.on('response', (response) => {
        resolve(this.processAiResponse(chatMessage, response));
      });

      apiaiRequest.on('error', (error) => {
        logger.error(error);
        reject(error);
      });

      apiaiRequest.end();
    }));
  }
};

