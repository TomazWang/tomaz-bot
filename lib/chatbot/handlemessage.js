// message handler.js


const logger = require("../../logger");
const AiBot = require('../ai/aibot');
const aibot = new AiBot();


/**
 * @param message
 * @return {Promise<module.Action|boolean>}
 */
function askForAi(message) {
  return aibot.processMessage(message);
}


/**
 *
 * @param {string} command [a command]
 * @return {Promise<module.Action|boolean>}
 *
 */
function commandAction(command) {
  return Promise.resolve(false);
}


/**
 * @param {module.ChatMessage} chatMessage
 */
function handleTextMessage(botName, chatMessage) {

  let rawText = chatMessage.context;

  if (!rawText.startsWith(botName)) {
    // ignore messages not starts with name
    logger.debug(`messagehandler.js#handleTextMessage: ignore message that aren't mention the bot.`);
    return new Promise(resolve => resolve());
  }


  // filter out real context
  let realContext = rawText.substr(rawText.indexOf(this.name) + this.name.length).trim();
  chatMessage._context = realContext;

  return commandAction(realContext).then(result => {
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