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
      snap.forEach(doc => {
        return doc.data();
      })
    });
};


/**
 *
 * @param user {module.User}
 */
module.exports.addUser = (user) => {
  let docRef = db.collection('users').doc();

  let uid = "";
  if (user.lineProfile && user.lineProfile.userId) {
    uid = uuidv3(user.lineProfile.userId, namespace);
  } else {
    uid = uuidv4();
  }

  docRef.set({
    name: user.name,
    line_profile: {
      user_id: user.lineProfile.userId,
      profile_name: user.lineProfile.profileName
    },
    join_since: new Date().toISOString(),
    u_id: uid
  });
};