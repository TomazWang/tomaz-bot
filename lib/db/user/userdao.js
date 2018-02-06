// userdao.js
const admin = require("firebase-admin");
const config = require("../firebaeconfig");
const logger = require("../../../logger");

const namespace = process.env.UUID;
const uuidv3 = require('uuid/v3');
const uuidv4 = require('uuid/v4');

admin.initializeApp({
  credential: admin.credential.cert(config),
  databaseURL: "https://tomaz-bot.firebaseio.com"
});

const db = admin.firestore();

/**
 * @param userId the tb-id
 */
module.exports.getUser = userId => {
  logger.debug(`userdao.js#getUser: with id ${userId}`);
  return db.collection(`users/${userId}`);
};


/**
 * @param lineId
 * @return {Promise<module.User>}
 */
module.exports.getUserByLineId = (lineId) => {
  logger.debug(`userdao.js#getUserByLineId: with line id = ${lineId}`);
  let userRef = db.collection('users/');
  return userRef.where('line_id', '==', lineId).get()
    .then(snap => {

      if (snap && snap.exists) {
        snap.forEach(doc => {
          return doc.data();
        })
      } else {
        return Promise.resolve(false)
      }
    });
};


/**
 *
 * @param {module.User} user
 * @param {string} uid
 * @return {{name, line_profile: {user_id: *, profile_name: *}, join_since: string, u_id: *}}
 */
function userToJson(user, uid) {


  let lineProfile = user.lineProfile;
  let lineUserId = lineProfile.userId ? lineProfile.userId : "";
  let lineProfileName = lineProfile.profileName ? lineProfile.profileName : "";

  return {
    name: user.name,
    join_since: new Date().toISOString(),
    u_id: uid,
    line_profile: {
      user_id: lineUserId,
      profile_name: lineProfileName
    }
  };
}


/**
 *
 * @param user {module.User}
 */
module.exports.addUser = (user) => {
  logger.debug(`userdao.js#addUser: user = ${JSON.stringify(user)}`);

  let docRef = db.collection('users').doc();

  let uid = "";
  if (user.lineProfile && user.lineProfile.userId) {
    uid = uuidv3(user.lineProfile.userId, namespace);
  } else {
    uid = uuidv4();
  }

  logger.debug(`userdao.js#addUser: before seting obj`);
  docRef.set(userToJson(user, uid));
};



