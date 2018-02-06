// user data module


/**
 * The basic user obj.
 * @class
 * @type {module.User}
 */
module.exports = class User {

  constructor(name, uuid) {
    this._name = name;
    this._uuid = uuid;
  }

  get name() {
    return this._name ? this._name : "";
  }

  set name(value) {
    this._name = value;
  }

  get lineProfile() {
    return this._lineProfile ? this._lineProfile : {};
  }

  /**
   * @param lineProfile {module.LineProfile}
   */
  set lineProfile(lineProfile) {
    this._lineProfile = lineProfile;
  }


};