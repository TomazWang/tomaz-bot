// actionhandler.js

import { createButtonAction, createButtonContext, BUTTON_ACTION_TYPE_MESSAGE } from '../messages/buttonContext';
import { ResponseMessage, RES_MSG_TYPE_BUTTON, RES_MSG_TYPE_TEXT } from '../messages/ResponseMessage';

/**
 *
 * # Actions
 *
 * ### echo action
 * +--- echo: fulfilled in DialogFlow.
 *
 *
 * ### weather action
 * +--- [ ] weather.ask
 *
 *
 * ### user action
 * +--- user.register: register user's profile, userId and name.
 * +--- user.register.already: return a friendly greeting with user's name.
 *
 *
 * ### Dev action
 * +--- dev.test
 * |    +--- dev.test.buttons: test line buttons template.
 * |
 * +--- [ ] dev.help
 * +--- dev.info
 * |   +--- [ ] dev.info.roomId: displays current roomId/groupId
 * |   +--- [ ] dev.info.userId: displays the userId of the user speaking
 * |
 * +--- ...
 *
 */
const Desc = require('../Destination');
const logger = require('../../../logger');

const userDao = require('../../db/user/userDao');
const User = require('../../db/user/User');
const LineProfile = require('../../db/user/LineProfile');

/**
 *
 * @param action {module.Action} dev.some.action
 * @return {Promise<ResponseMessage>}
 */
function handleDevAction(action) {
  const { actionName } = action;
  logger.error(`handleaction.js#handleDevAction: handle default command ${actionName}`);

  if (actionName === 'dev.test.buttons') {
    // send test buttons

    // 1. create some actions
    const action1 = createButtonAction({
      type: BUTTON_ACTION_TYPE_MESSAGE,
      label: 'func 1',
      text: '[Test][btn_func1]',
    });

    const action2 = createButtonAction({
      type: BUTTON_ACTION_TYPE_MESSAGE,
      label: 'func 2',
      text: '[Test][btn_func2]',
    });

    // 2. create button from the actions
    const btnContext = createButtonContext({
      message: 'click something',
      buttonActions: [action1, action2],
    });


    // simple reply
    const des = new Desc(action.chatMessage.source.from);
    const rm = new ResponseMessage(des, RES_MSG_TYPE_BUTTON, btnContext);

    return Promise.resolve(rm);
  }

  const desc = new Desc(action.chatMessage.source.from);
  const rm = new ResponseMessage(desc, RES_MSG_TYPE_TEXT, `${actionName} is not compelted yet.`);
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
    const rm = new ResponseMessage(desc, RES_MSG_TYPE_TEXT, `哈囉 ${userName}😊`);

    return Promise.resolve(rm);
  } else if (action.actionName === 'user.register') {
    logger.debug('handleaction.js#handleUserAction: handle user.register');

    const param = action.extra.df_parameter;
    const { userName } = param;

    if (action.needFollowUp) {
      logger.debug('handleaction.js#handleUserAction: needs follow up');

      const rm = new ResponseMessage(desc, RES_MSG_TYPE_TEXT, action.speech);
      return Promise.resolve(rm);
    } else if (userName) {
      logger.debug(`handleaction.js#handleUserAction: got user_name = ${param.user_name}`);

      const userObj = new User(userName, '');

      const { source } = action.chatMessage;

      userObj.lineProfile = new LineProfile(source.speaker, '');

      userDao.addUser(userObj);

      const rm = new ResponseMessage(desc, RES_MSG_TYPE_TEXT, action.speech);
      return Promise.resolve(rm);
    }
  }

  const rm = new ResponseMessage(desc, RES_MSG_TYPE_TEXT, '好像出了點問題，請稍後再試 😞');
  return Promise.resolve(rm);
}

/**
 * The main entrance of handleAction
 *
 * @param {module.Action} action
 * @return {Promise<ResponseMessage>}
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

  const desc = new Desc(action.chatMessage.source.from);
  const rm = new ResponseMessage(desc, 'text', action.speech);
  return Promise.resolve(rm);
};
