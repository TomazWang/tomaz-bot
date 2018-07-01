import {
  RES_MSG_TYPE_TEXT,
  ResponseMessage,
} from '../messages/ResponseMessage';

const Desc = require('../Destination');
const logger = require('../../../logger');
const userDao = require('../../db/user/userDao');
const User = require('../../db/user/User');
const LineProfile = require('../../db/user/LineProfile');
const AiBot = require('../../ai/AiBot');

const aiBot = new AiBot();


export const USER_ACTION_REGISTER = 'user.register';
export const USER_ACTION_REGISTER_ALREADY = 'user.register.already';
export const USER_ACTION_GREETING = 'user.greeting';

function userRegisterAlready(action) {
  const desc = new Desc(action.chatMessage.source.from);
  logger.debug('handleAction.js#handleUserAction: handle user.register.already');

  const { userName } = action.extra.user;
  const rm = new ResponseMessage(desc, RES_MSG_TYPE_TEXT, `哈囉 ${userName}😊`);

  return Promise.resolve(rm);
}

/**
 * @deprecated
 * @param action
 * @return {Promise<ResponseMessage>}
 */
function userRegister(action) {
  const desc = new Desc(action.chatMessage.from);
  logger.debug('handleaction.js#handleUserAction: handle user.register');

  const param = action.extra.df_parameter;
  const { userName } = param;
  const rm = new ResponseMessage(desc, RES_MSG_TYPE_TEXT, action.speech);

  if (action.needFollowUp) {
    logger.debug('handleaction.js#handleUserAction: needs follow up');
    return Promise.resolve(rm);
  } else if (userName) {
    logger.debug(`handleaction.js#handleUserAction: got user_name = ${param.user_name}`);

    const userObj = new User(userName, '');

    const { source } = action.chatMessage;

    userObj.lineProfile = new LineProfile(source.speaker, '');

    userDao.addUser(userObj);

    return Promise.resolve(rm);
  }
  return Promise.resolve(rm);
}

/**
 * @param action {module.Action}
 */
async function userGreeting(action) {
  const { speaker, from, fromPlatform } = action.chatMessage;

  if (fromPlatform === 'line') {
    const user = userDao.getUserByLineId(speaker);
    if (user) {
      const event = {
        name: 'bot-user-register',
        data: {
          // line_profile_name:
        },
      };
      return aiBot.processEvent(action.chatMessage, {
        name: 'e-user-greeting',
        data: {

        },
      });
    }
    return aiBot.processEvent(action.chatMessage, 'e-user-register');
  }

  const desc = new Desc(from);
  const rm = new ResponseMessage(desc, RES_MSG_TYPE_TEXT, '你好阿');
  return Promise.resolve(rm);
}


/**
 * @param {module.Action} action
 * @return {Promise<ResponseMessage>}
 */
export default function handleUserAction(action) {
  logger.debug(`handleAction.js#handleUserAction: action = ${JSON.stringify(action)}`);

  if (action.actionName === USER_ACTION_REGISTER_ALREADY) {
    return userRegisterAlready(action);
  } else if (action.actionName === USER_ACTION_REGISTER) {
    return userRegister(action);
  } else if (action.actionName === USER_ACTION_GREETING) {
    return userGreeting(action);
  }

  const desc = new Desc(action.chatMessage.from);
  const rm = new ResponseMessage(desc, RES_MSG_TYPE_TEXT, '好像出了點問題，請稍後再試 😞');
  return Promise.resolve(rm);
}

