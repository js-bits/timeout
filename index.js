import enumerate from '@js-bits/enumerate';
import ExtendablePromise from '@js-bits/xpromise';

// pseudo-private properties emulation in order to avoid source code transpiling
// TODO: replace with #privateField syntax when it gains wide support
const ø = enumerate`
  id
`;

const ERRORS = enumerate(String)`
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
class Timeout extends ExtendablePromise {
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

export default Timeout;
