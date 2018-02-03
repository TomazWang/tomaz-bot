/**
 * @class
 * @type {module.Destination}
 */
module.exports = class Destination {

  /**
   * @param to
   */
  constructor(to) {
    this._des = to;
  }

  get to() {
    return this._des;
  }
};