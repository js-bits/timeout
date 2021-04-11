// private properties
const TIMEOUT = Symbol('timeout');
const PROMISE = Symbol('promise');
const RESOLVE = Symbol('resolve');
const REJECT = Symbol('reject');
const ID = Symbol('timeoutId');

const ERRORS = {
  TIMEOUT_EXCEEDED: 'TimeoutExceededError',
  INITIALIZATION: 'TimeoutInitializationError',
};

/**
 * Convenient, promise-based way to work with timeouts
 * @class
 * @param {Number} timeout - number of milliseconds
 * @throws {TimeoutInitializationError}
 */
class Timeout {
  constructor(timeout) {
    if (!Number.isInteger(timeout) || timeout <= 0) {
      const error = new Error('Timeout value must be a positive integer');
      error.name = ERRORS.INITIALIZATION;
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
     * Alternative way to catch an error.
     * @param {Function} callback
     * @returns {Promise}
     */
    this.catch = promise.catch.bind(promise);
    this[TIMEOUT] = timeout;
    this[PROMISE] = promise;
  }

  /**
   * Starts timer.
   * @returns {Promise} - timeout promise
   */
  start() {
    if (this[TIMEOUT] && !this[ID]) {
      this[ID] = setTimeout(() => {
        const error = new Error('Operation timeout exceeded');
        error.name = ERRORS.TIMEOUT_EXCEEDED;
        this[REJECT](error);
      }, this[TIMEOUT]);
    }
    return this[PROMISE];
  }

  /**
   * Stops timer and resolves timeout promise.
   * @returns {Promise} - timeout promise
   */
  stop() {
    if (this[ID]) {
      clearTimeout(this[ID]);
      this[RESOLVE]();
    }
    return this[PROMISE];
  }
}

Timeout.ERRORS = ERRORS;

export default Timeout;
