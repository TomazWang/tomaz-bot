// message handler.js


const logger = require('../../logger');

const userDao = require('../db/user/userDao');

const AiBot = require('../ai/AiBot');

const aibot = new AiBot();

const Action = require('./action/Action');


/**
 * @param chatMessage
 * @return {Promise<module.Action|boolean>}
 */
function askForAi(chatMessage) {
  return aibot.processMessage(chatMessage);
}

/**
 *
 * @param {module.ChatMessage} chatMessage
 * @param event line message event
 * @return {Promise<module.Action|boolean>}
 */
function sendEventToAi(chatMessage, event) {
  return aibot.processEvent(chatMessage, event);
}


/**
 * @param {module.ChatMessage} chatMessage
 * resolve when
 * @return {Promise<module.Action|boolean>}
 */
function handleRegister(chatMessage) {
  logger.debug(`handlemessage.js#handleRegister: with chatMessage = ${JSON.stringify(chatMessage)}`);

  return userDao
    .getUserByLineId(chatMessage.source.speaker)

    .then((user) => {
      if (!user) {
        logger.debug('handlemessage.js#: send event regitster');
        const event = {
          name: 'bot-user-register',
          data: {
            // line_profile_name:
          },
        };
        return sendEventToAi(chatMessage, event);
      }
      logger.debug('handlemessage.js#: already a user');

      const action = new Action(chatMessage, 'user.register.already');
      action.extra = {
        user,
      };

      return Promise.resolve(action);
    });
}

/**
 *
 * @param {string} command [a command]
 * @param {module.ChatMessage} chatMessage [the original chatMessage]
 * @return {Promise<module.Action|boolean>}
 *
 */
function commandAction(command, chatMessage) {
  logger.debug(`handlemessage.js#commandAction: command = ${command}`);

  if (command === '哈囉你好！') {
    return handleRegister(chatMessage);
  } else if (command.startsWith('dev.test')) {
    return Promise.resolve(new Action(chatMessage, command));
  }

  return Promise.resolve(false);
}


/**
 * @param botName {string} the name of this bot
 * @param {module.ChatMessage} chatMessage
 */
function handleTextMessage(botName, chatMessage) {
  const rawText = chatMessage.context;

  const isMentioned = rawText.startsWith(botName);

  if (chatMessage.source.type !== 'user' && !isMentioned) {
    // ignore messages not starts with name
    logger.debug('messagehandler.js#handleTextMessage: ignore message that aren\'t mention the bot.');
    return new Promise(resolve => resolve());
  }


  // filter out real context
  const realContext = isMentioned ? rawText.replace(botName, '').trim() : rawText.trim();
  const realChatMessage = chatMessage;
  realChatMessage.context = realContext;

  return commandAction(realContext, realChatMessage).then((result) => {
    if (result) {
      return result;
    }
    return askForAi(realChatMessage);
  });
}


/**
 * @param {string} botName
 * @param {module.ChatMessage} chatMessage
 * @return {Promise<Action|boolean>}
 */
module.exports = function handleMessage(botName, chatMessage) {
  let promise;

  switch (chatMessage.type) {
    case 'text':
      promise = handleTextMessage(botName, chatMessage);
      break;
    default:
      promise = Promise.resolve(false);
  }


  return promise;
};
