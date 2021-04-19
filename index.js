import enumerate from '@js-bits/enumerate';

// private properties
const TIMEOUT = Symbol('timeout');
const PROMISE = Symbol('promise');
const RESOLVE = Symbol('resolve');
const REJECT = Symbol('reject');
const ID = Symbol('timeoutId');

const ERRORS = enumerate(String)`
  TimeoutExceededError
  TimeoutInitializationError
`;

/**
 * Rejects a promise with an error if it does not settle within the specified timeout
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

    const finalize = () => {
      this[TIMEOUT] = undefined;
      this[ID] = undefined;
      this[RESOLVE] = undefined;
      this[REJECT] = undefined;
    };

    const promise = new Promise((resolve, reject) => {
      this[RESOLVE] = value => {
        finalize();
        resolve(value);
      };
      this[REJECT] = reason => {
        finalize();
        reject(reason);
      };
    });

    /**
     * An alternative way to catch errors
     * @param {Function} callback
     * @returns {Promise}
     */
    this.catch = promise.catch.bind(promise);
    this[TIMEOUT] = timeout;
    this[PROMISE] = promise;
  }

  /**
   * Initiates a timer for the specified timeout
   * @returns {Promise} - timeout promise
   * @throws {TimeoutExceededError}
   */
  start() {
    if (this[TIMEOUT] && !this[ID]) {
      this[ID] = setTimeout(() => {
        const error = new Error('Operation timeout exceeded');
        error.name = Timeout.TimeoutExceededError;
        this[REJECT](error);
      }, this[TIMEOUT]);
    }
    return this[PROMISE];
  }

  /**
   * Stops the timer and resolves the timeout promise
   * @returns {Promise} - timeout promise
   */
  stop() {
    if (this[ID]) {
      clearTimeout(this[ID]);
    }
    if (this[RESOLVE]) {
      this[RESOLVE]();
    }
    return this[PROMISE];
  }
}

Object.assign(Timeout, ERRORS);

export default Timeout;
