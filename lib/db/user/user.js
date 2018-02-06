// user data module


/**
 * The basic user obj.
 * @class
 * @type {module.User}
 */
module.exports = class User {

  constructor(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get lineProfile() {
    return this._lineProfile;
  }

  /**
   * @param lineProfile {module.LineProfile}
   */
  set lineProfile(lineProfile) {
    this._lineProfile = lineProfile;
  }


};