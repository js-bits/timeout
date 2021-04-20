import enumerate from '@js-bits/enumerate';

// pseudo-private properties emulation in order to avoid source code transpiling
// TODO: replace with #privateField syntax when it gains wide support
const ø = enumerate`
  id
  timeout
  promise
  resolve
  reject
  finalize
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
 */
class Timeout {
  constructor(timeout) {
    if (!Number.isInteger(timeout) || timeout <= 0) {
      const error = new Error('Timeout value must be a positive integer');
      error.name = Timeout.TimeoutInitializationError;
      throw error;
    }

    const promise = new Promise((resolve, reject) => {
      this[ø.resolve] = value => {
        this[ø.finalize]();
        resolve(value);
      };
      this[ø.reject] = reason => {
        this[ø.finalize]();
        reject(reason);
      };
    });

    /**
     * An alternative way to catch errors
     * @param {Function} callback
     * @returns {Promise}
     */
    this.catch = promise.catch.bind(promise);
    this[ø.timeout] = timeout;
    this[ø.promise] = promise;
  }

  /**
   * Initiates a timer for the specified timeout
   * @returns {Promise} - timeout promise
   * @throws {TimeoutExceededError}
   */
  set() {
    if (this[ø.timeout] && !this[ø.id]) {
      this[ø.id] = setTimeout(() => {
        const error = new Error('Operation timeout exceeded');
        error.name = Timeout.TimeoutExceededError;
        this[ø.reject](error);
      }, this[ø.timeout]);
    }
    return this[ø.promise];
  }

  /**
   * Clears the timeout and resolves the timeout promise
   * @returns {Promise} - timeout promise
   */
  clear() {
    if (this[ø.id]) {
      clearTimeout(this[ø.id]);
    }
    if (this[ø.resolve]) {
      this[ø.resolve]();
    }
    return this[ø.promise];
  }

  [ø.finalize]() {
    this[ø.timeout] = undefined;
    this[ø.id] = undefined;
    this[ø.resolve] = undefined;
    this[ø.reject] = undefined;
  }
}

Object.assign(Timeout, ERRORS);

export default Timeout;
