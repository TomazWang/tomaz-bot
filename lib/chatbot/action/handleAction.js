// actionhandler.js

import { createButtonAction, createButtonContext } from '../messages/buttonContext';

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
const ResponseMessage = require('../messages/ResponseMessage');
const Desc = require('../Destination');
const logger = require('../../../logger');

const userDao = require('../../db/user/userDao');
const User = require('../../db/user/User');
const LineProfile = require('../../db/user/LineProfile');


/**
 *
 * @param action {module.Action} dev.some.action
 * @return {Promise<module.ResponseMessage>}
 */
function handleDevAction(action) {
  const { actionName } = action;
  logger.error(`handleaction.js#handleDevAction: handle default command ${actionName}`);

  if (actionName === 'dev.test.buttons') {
    const action1 = createButtonAction({
      type: 'message',
      label: 'func 1',
      text: '[Test][btn_func1]',
    });

    const action2 = createButtonAction({
      type: 'message',
      label: 'func 2',
      text: '[Test][btn_func2]',
    });

    const btnContext = createButtonContext({
      message: 'click something',
      buttonActions: [action1, action2],
    });

    const rm = new ResponseMessage(action.chatMessage.source.from, 'buttons', btnContext);

    return Promise.resolve(rm);
  }

  const desc = new Desc(action.chatMessage.source.from);
  const rm = new ResponseMessage(desc, 'text', `${actionName} is not compelted yet.`);
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

  const { actionName, needFollowUp } = action;

  if (needFollowUp) {
    const desc = new Desc(action.chatMessage.source.from);
    const rm = new ResponseMessage(desc, 'text', action.speech);
    return Promise.resolve(rm);
  }

  if (actionName.startsWith('dev')) {
    return handleDevAction(action);
  }

  if (actionName.startsWith('user')) {
    return handleUserAction(action);
  }

  // other un-categories actions.
  switch (actionName) {
    default:
      const desc = new Desc(action.chatMessage.source.from);
      const rm = new ResponseMessage(desc, 'text', action.speech);
      return Promise.resolve(rm);
  }
};
