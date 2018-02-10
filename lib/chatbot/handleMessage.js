// message handler.js


const logger = require("../../logger");

const userDao = require("../db/user/userDao");

const AiBot = require('../ai/AiBot');
const aibot = new AiBot();

const Action = require("./action/Action");


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

    .then(user => {

        console.log(user);

        if (!user) {
          logger.debug(`handlemessage.js#: send event regitster`);
          let event = {
            name: "bot-user-register",
            data: {
              // line_profile_name:
            }
          };
          return sendEventToAi(chatMessage, event)

        } else {
          logger.debug(`handlemessage.js#: already a user`);

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
    case '哈囉你好！':
      return handleRegister(chatMessage);
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
      return result;
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