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
  let command = action.actionName.split('.').pop();

  logger.error(`handleaction.js#handleDevAction: handle command ${command}`);

  let desc = new Desc(action.chatMessage.source.from);
  let rm = new ResponseMessage(desc, 'text', `${command} is not compelted yet.`);

  return Promise.resolve(rm);

}

/**
 * @param {module.Action} action
 * @return {Promise<module.ResponseMessage>}
 */
function handleUserAction(action) {
  logger.debug(`handleaction.js#handleUserAction: action = ${JSON.stringify(action)}`);

  let desc = new Desc(action.chatMessage.source.from);

  if (action.actionName === "user.register.already") {

    logger.debug(`handleaction.js#handleUserAction: handle user.register.already`);


    let user = action.extra.user;
    let rm = new ResponseMessage(desc, 'text', `哈囉 ${user.name}😊`);

    return Promise.resolve(rm);
  } else if (action.actionName === "user.register") {

    logger.debug(`handleaction.js#handleUserAction: handle user.register`);

    let param = action.extra.df_parameter;

    if (action.needFollowUp) {

      logger.debug(`handleaction.js#handleUserAction: needs follow up`);

      let rm = new ResponseMessage(desc, 'text', action.speech);
      return Promise.resolve(rm);

    } else if (param.user_name) {

      logger.debug(`handleaction.js#handleUserAction: got user_name = ${param.user_name}`);

      let userName = param.user_name;
      let userObj = new User(userName, "");

      let chatMessage = action.chatMessage;

      userObj.lineProfile = new LineProfile(chatMessage.source.speaker, "");

      userDao.addUser(userObj);

      let rm = new ResponseMessage(desc, 'text', action.speech);
      return Promise.resolve(rm);
    }
  }

  let rm = new ResponseMessage(desc, 'text', "好像出了點問題，請稍後再試 😞");
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
    let desc = new Desc(action.chatMessage.source.from);
    let rm = new ResponseMessage(desc, 'text', action.speech);
    return Promise.resolve(rm);
  }

  let actionName = action.actionName;

  if (actionName.startsWith('dev')) {
    return handleDevAction(action);
  }

  if (actionName.startsWith('user')) {
    return handleUserAction(action);
  }

  switch (action.actionName) {

    default:
      let desc = new Desc(action.chatMessage.source.from);
      let rm = new ResponseMessage(desc, 'text', action.speech);
      return Promise.resolve(rm);
  }

};