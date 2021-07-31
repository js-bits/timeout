'use strict';

var enumerate = require('@js-bits/enumerate');
var ExtendablePromise = require('@js-bits/xpromise');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var enumerate__default = /*#__PURE__*/_interopDefaultLegacy(enumerate);
var ExtendablePromise__default = /*#__PURE__*/_interopDefaultLegacy(ExtendablePromise);

// pseudo-private properties emulation in order to avoid source code transpiling
// TODO: replace with #privateField syntax when it gains wide support
const ø = enumerate__default['default']`
  id
`;

const ERRORS = enumerate__default['default'](String)`
  TimeoutExceededError
  TimeoutInitializationError
`;

/**
 * Rejects the promise with an error if it does not settle within a specified timeout
 * @class
 * @param {Number} timeout - number of milliseconds
 * @throws {TimeoutInitializationError}
 * @throws {TimeoutExceededError}
 */
class Timeout extends ExtendablePromise__default['default'] {
  constructor(timeout) {
    if (!Number.isInteger(timeout) || timeout <= 0) {
      const error = new Error('Timeout value must be a positive integer');
      error.name = Timeout.TimeoutInitializationError;
      throw error;
    }

    super((...[, reject]) => {
      this[ø.id] = setTimeout(() => {
        const error = new Error('Operation timeout exceeded');
        error.name = Timeout.TimeoutExceededError;
        reject(error);
      }, timeout);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'Timeout';
  }

  /**
   * Initiates a timer for the specified timeout
   * @returns {Promise} - timeout promise
   * @throws {TimeoutExceededError}
   */
  set() {
    if (!this[ø.id]) {
      this.execute();
    }
    return this;
  }

  /**
   * Clears the timeout and resolves the timeout promise
   * @returns {Promise} - timeout promise
   */
  clear() {
    if (this[ø.id]) {
      clearTimeout(this[ø.id]);
    }
    this.resolve();
    return this;
  }
}

Object.assign(Timeout, ERRORS);

module.exports = Timeout;
