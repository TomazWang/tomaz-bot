// actionhandler.js

/**
 *
 * # Actions
 *
 * ### echo action
 * |--- echo
 *
 *
 * ### weather action
 * |--- weather.ask
 *
 *
 *
 * ### Dev action
 * |--- dev.help
 * |--- dev.roomId
 * |--- dev.userId
 *
 */
const ResponseMessage = require('./responseMessage');
const Desc = require('./destination');
const logger = require('./../../logger');


/**
 * @param action {module.Action}
 * @return {Promise<void>}
 */
function handleDevAction(action) {
  let command = action.actionName.split('.').pop();

  logger.error(`handleaction.js#handleDevAction: handle command ${command}`);

  let desc = new Desc(action.chatMessage.source.from);
  let rm = new ResponseMessage(desc, 'text', `${command} is not compelted yet.`);

  return Promise.resolve(rm);

}

/**
 *
 * @param {module.Action} action
 * @return {Promise<module.ResponseMessage>}
 */
module.exports = function handleAction(action) {

  if (action.needFollowUp) {
    let desc = new Desc(action.chatMessage.source.from);
    let rm = new ResponseMessage(desc, 'text', action.speech);
    return Promise.resolve(rm);
  }

  let actionName = action.actionName;

  if (actionName.startsWith('dev')) {
    return handleDevAction(action);
  }

  switch (action.actionName) {

    default:
      let desc = new Desc(action.chatMessage.source.from);
      let rm = new ResponseMessage(desc, 'text', action.speech);
      return Promise.resolve(rm);
  }

};