'use strict';

var enumerate = require('@js-bits/enumerate');
var ExtendablePromise = require('@js-bits/xpromise');

// pseudo-private properties emulation in order to avoid source code transpiling
// TODO: replace with #privateField syntax when it gains wide support
const ø = enumerate.ts(`
  id
`);

const ERRORS = enumerate.ts(
  `
  InitializationError
  TimeoutExceededError
`,
  enumerate.Prefix('Timeout|')
);

/**
 * Rejects the promise with an error if it does not settle within a specified timeout
 * @class
 * @param {Number} timeout - number of milliseconds
 * @extends {ExtendablePromise<undefined>}
 */
class Timeout extends ExtendablePromise {
  /**
   * @type {'Timeout|InitializationError'}
   * @readonly
   */
  static InitializationError = ERRORS.InitializationError;

  /**
   * @type {'Timeout|TimeoutExceededError'}
   * @readonly
   */
  static TimeoutExceededError = ERRORS.TimeoutExceededError;

  /**
   *
   * @param {number} timeout
   * @throws {typeof Timeout.InitializationError}
   * @throws {typeof Timeout.TimeoutExceededError}
   */
  constructor(timeout) {
    if (!Number.isInteger(timeout) || timeout <= 0) {
      const error = new Error('Timeout value must be a positive integer');
      error.name = ERRORS.InitializationError;
      throw error;
    }

    super((...[, reject]) => {
      this[ø.id] = /** @type {number} */ setTimeout(() => {
        const error = new Error('Operation timeout exceeded');
        error.name = ERRORS.TimeoutExceededError;
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
   * @returns {Timeout} - timeout promise
   * @throws {typeof Timeout.TimeoutExceededError}
   */
  set() {
    if (!this[ø.id]) {
      this.execute();
    }
    return this;
  }

  /**
   * Clears the timeout and resolves the timeout promise
   * @returns {Timeout} - timeout promise
   */
  clear() {
    if (this[ø.id]) {
      clearTimeout(this[ø.id]);
    }
    this.resolve();
    return this;
  }
}

module.exports = Timeout;
