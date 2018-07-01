// actionhandler.js
import handleUserAction from './handleUserAction';
import {
  createButtonAction, createButtonContext, BUTTON_ACTION_TYPE_MESSAGE,
  createConfirmContext,
} from '../messages/buttonContext';
import {
  ResponseMessage, RES_MSG_TYPE_BUTTON, RES_MSG_TYPE_TEXT,
  RES_MSG_TYPE_CONFIRM,
} from '../messages/ResponseMessage';

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
 * +--- user.greeting: user sends a greeting to bot.
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

  if (actionName === 'dev.test.confirm') {
    // send test confirm temp

    // 1. create some actions
    const confirmAction1 = createButtonAction({
      type: BUTTON_ACTION_TYPE_MESSAGE,
      label: 'OK',
      text: 'OK',
    });

    const confirmAction2 = createButtonAction({
      type: BUTTON_ACTION_TYPE_MESSAGE,
      label: 'Cancel',
      text: 'Cancel',
    });

    // 2. create context
    const confirmContext = createConfirmContext({
      buttonActions: [confirmAction1, confirmAction2],
      message: 'Are you sure?',
    });

    // simple reply
    const confirmDes = new Desc(action.chatMessage.source.from);
    logger.debug(`handleAction.js#handleDevAction: confirmDes = ${JSON.stringify(confirmDes)}`);
    const confirmRm = new ResponseMessage(
      confirmDes, RES_MSG_TYPE_CONFIRM,
      confirmContext,
    );

    logger.debug(`handleAction.js#handleDevAction: confirm rm = ${JSON.stringify(confirmRm)}`);
    return Promise.resolve(confirmRm);
  }

  const desc = new Desc(action.chatMessage.source.from);
  const rm = new ResponseMessage(desc, RES_MSG_TYPE_TEXT, `${actionName} is not compelted yet.`);
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
