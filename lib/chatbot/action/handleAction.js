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
 * ### user action
 * |--- user.register
 * |--- user.register.already
 *
 * ### Dev action
 * |--- dev.help
 * |--- dev.roomId
 * |--- dev.userId
 *
 */
const ResponseMessage = require('../ResponseMessage');
const Desc = require('../Destination');
const logger = require('../../../logger');

const userDao = require('../../db/user/userDao');
const User = require('../../db/user/User');
const LineProfile = require('../../db/user/LineProfile');


/**
 * @param action {module.Action}
 * @return {Promise<void>}
 */
function handleDevAction(action) {
  const command = action.actionName.split('.').pop();

  logger.error(`handleaction.js#handleDevAction: handle command ${command}`);

  const desc = new Desc(action.chatMessage.source.from);
  const rm = new ResponseMessage(desc, 'text', `${command} is not compelted yet.`);

  return Promise.resolve(rm);
}

/**
 * @param {module.Action} action
 * @return {Promise<module.ResponseMessage>}
 */
function handleUserAction(action) {
  logger.debug(`handleAction.js#handleUserAction: action = ${JSON.stringify(action)}`);

  const desc = new Desc(action.chatMessage.source.from);
  if (action.actionName === 'user.register.already') {
    logger.debug('handleAction.js#handleUserAction: handle user.register.already');


    const { userName } = action.extra.user;
    const rm = new ResponseMessage(desc, 'text', `哈囉 ${userName}😊`);

    return Promise.resolve(rm);
  } else if (action.actionName === 'user.register') {
    logger.debug('handleaction.js#handleUserAction: handle user.register');

    const param = action.extra.df_parameter;

    if (action.needFollowUp) {
      logger.debug('handleaction.js#handleUserAction: needs follow up');

      const rm = new ResponseMessage(desc, 'text', action.speech);
      return Promise.resolve(rm);
    } else if (param.user_name) {
      logger.debug(`handleaction.js#handleUserAction: got user_name = ${param.user_name}`);

      const userName = param.user_name;
      const userObj = new User(userName, '');

      const { source } = action.chatMessage;

      userObj.lineProfile = new LineProfile(source.speaker, '');

      userDao.addUser(userObj);

      const rm = new ResponseMessage(desc, 'text', action.speech);
      return Promise.resolve(rm);
    }
  }

  const rm = new ResponseMessage(desc, 'text', '好像出了點問題，請稍後再試 😞');
  return Promise.resolve(rm);
}

/**
 * The main entrance of handleAction
 *
 * @param {module.Action} action
 * @return {Promise<module.ResponseMessage>}
 */
module.exports = function handleAction(action) {
  logger.debug(`handleaction.js#handleAction: action = ${JSON.stringify(action)}`);

  if (action.needFollowUp) {
    const desc = new Desc(action.chatMessage.source.from);
    const rm = new ResponseMessage(desc, 'text', action.speech);
    return Promise.resolve(rm);
  }

  const actionName = action.actionName;

  if (actionName.startsWith('dev')) {
    return handleDevAction(action);
  }

  if (actionName.startsWith('user')) {
    return handleUserAction(action);
  }

  switch (action.actionName) {
    default:
      const desc = new Desc(action.chatMessage.source.from);
      const rm = new ResponseMessage(desc, 'text', action.speech);
      return Promise.resolve(rm);
  }
};
