/**
 * @class
 * @type {module.Destination}
 */
module.exports = class Destination {
  /**
   * @param to
   */
  constructor(to) {
    this.des = to;
  }

  get to() {
    return this.des;
  }
};
