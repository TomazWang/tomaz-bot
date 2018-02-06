// message handler.js


const logger = require("../../logger");

const userDao = require("../db/user/userdao");

const AiBot = require('../ai/aibot');
const aibot = new AiBot();

const Action = require("./action");


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

  return new Promise(resolve => {
    return userDao.getUserByLineId(chatMessage.source.speaker);
  }).then(user => {
      if (!user) {
        let event = {
          name: "bot-user-register",
          data: {
            // line_profile_name:
          }
        };
        return sendEventToAi(chatMessage, event)
      } else {
        let action = new Action(chatMessage, 'user.register.already');
        action.extra = {
          user: user
        };

        return Promise.resolve(action);
      }
    }
  )
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

  switch (command) {
    case '[BotCmd][register]':
    case '我要註冊':
      return handleRegister(chatMessage).then(result => {
        return Promise.resolve(true)
      });
  }


  return Promise.resolve(false);
}


/**
 * @param botName {string} the name of this bot
 * @param {module.ChatMessage} chatMessage
 */
function handleTextMessage(botName, chatMessage) {

  let rawText = chatMessage.context;

  let isMentioned = rawText.startsWith(botName);

  if (chatMessage.source.type !== 'user' && !isMentioned) {
    // ignore messages not starts with name
    logger.debug(`messagehandler.js#handleTextMessage: ignore message that aren't mention the bot.`);
    return new Promise(resolve => resolve());
  }


  // filter out real context
  let realContext = isMentioned ? rawText.replace(botName, '').trim() : rawText.trim();
  chatMessage._context = realContext;

  return commandAction(realContext, chatMessage).then(result => {
    if (result) {
      return Promise.resolve(true);
    } else {
      return askForAi(chatMessage);
    }
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