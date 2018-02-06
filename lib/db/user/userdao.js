// userdao.js
const admin = require("firebase-admin");
const config = require("../firebaeconfig");
const logger = require("../../../logger");

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
  docRef.set({
    name: user.name,
    line_id: user.lineId
  });
};