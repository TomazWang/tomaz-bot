// lineprofile.js

module.exports = class LineProfile {

  constructor(userId, profileName) {
    this._userId = userId;
    this._profileName = profileName;
  }

  get userId() {
    return this._userId;
  }

  set userId(value) {
    this._userId = value;
  }

  get profileName() {
    return this._profileName;
  }

  set profileName(value) {
    this._profileName = value;
  }

};
