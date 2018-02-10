// user data module


/**
 * The basic user obj.
 * @class
 * @type {module.User}
 */
module.exports = class User {
  constructor(name, uuid) {
    this.name = name || '';
    this.uuid = uuid;
  }

  get lineProfile() {
    return this.mLineProfile ? this.mLineProfile : {};
  }

  /**
   * @param profile {module.LineProfile}
   */
  set lineProfile(profile) {
    this.mLineProfile = profile;
  }
};
