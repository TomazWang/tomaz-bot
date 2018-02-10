// userdao.js
require('dotenv').config();

const logger = require('../../../logger');
const uuidv3 = require('uuid/v3');
const uuidv4 = require('uuid/v4');

const User = require('./User');
const LineProfile = require('./LineProfile');

const { dbRootRef } = require('../dbRef');

const namespace = process.env.UUID;

// const db = admin.firestore();

/**
 * @param userId the tb-id
 */
function getUser(userId) {
  logger.debug(`userdao.js#getUser: with id ${userId}`);
  return dbRootRef.collection('users').doc(userId).get();
}

/**
 * @return {module.User}
 */
function dataToUser(data) {
  logger.debug(`userdao.js#dataToUser: data = ${JSON.stringify(data)}`);

  const user = new User(data.name, data.u_id);
  user.lineProfile = new LineProfile(data.line_profile.user_id, data.line_profile.profile_name);

  return user;
}

/**
 * @param lineId
 * @return {Promise<module.User>}
 */
function getUserByLineId(lineId) {
  logger.debug(`userdao.js#getUserByLineId: with line id = ${lineId}`);

  const userRef = dbRootRef.collection('users');
  return userRef.where('line_profile.user_id', '==', lineId).get()
    .then((snap) => {
      if (snap && !snap.empty) {
        logger.debug('userdao.js#: got some data');
        const doc = snap.docs[0];
        return Promise.resolve(dataToUser(doc.data()));
      }
      logger.debug('userdao.js#: no result');
      return Promise.resolve(false);
    });
}


/**
 *
 * @param {module.User} user
 * @param {string} uid
 * @return {{name, line_profile: {user_id: *, profile_name: *}, join_since: string, u_id: *}}
 */
function userToJson(user, uid) {
  const { lineProfile } = user;
  const lineUserId = lineProfile.userId || '';
  const lineProfileName = lineProfile.profileName || '';

  return {
    name: user.name,
    join_since: new Date().toISOString(),
    u_id: uid,
    line_profile: {
      user_id: lineUserId,
      profile_name: lineProfileName,
    },
  };
}


/**
 *
 * @param user {module.User}
 */
function addUser(user) {
  logger.debug(`userdao.js#addUser: user = ${JSON.stringify(user)}`);


  let uid = '';
  if (user.lineProfile && user.lineProfile.userId) {
    uid = uuidv3(user.lineProfile.userId, namespace);
  } else {
    uid = uuidv4();
  }

  const docRef = dbRootRef.collection('users').doc(uid);

  logger.debug('userdao.js#addUser: before seting obj');

  docRef.set(userToJson(user, uid));
}


module.exports = {
  addUser,
  getUserByLineId,
  getUser,
};
