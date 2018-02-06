// user data module


module.exports = class User {

  constructor(name) {
    this._lineId = "";
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get lineId() {
    return this._lineId;
  }

  set lineId(value) {
    this._lineId = value;
  }
};