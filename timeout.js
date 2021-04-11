// private properties
const TIMEOUT = Symbol('timeout');
const PROMISE = Symbol('promise');
const RESOLVE = Symbol('resolve');
const REJECT = Symbol('reject');
const ID = Symbol('timeoutId');

const ERRORS = {
  TIMEOUT: 'TimeoutError',
  INITIALIZATION: 'TimeoutInitializationError',
};

/**
 * More convenient way to work with timeouts
 * @class
 * @param {Number} timeout - number of milliseconds
 * @throws {TimeoutInitializationError}
 * @example
 * let timeout = new Timeout(1000); // 1 sec
 * timeout.start().catch((reason) => {
 *     // timeout exceeded
 * });
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
     * Additional way to catch error.
     * @example
     * let timeout = new Timeout(2000); // 2 sec
     * ...
     * timeout.start();
     * ...
     * timeout.catch(function(reason) {
     *     // timeout exceeded
     * });
     */
    this.catch = promise.catch.bind(promise);
    this[TIMEOUT] = timeout;
    this[PROMISE] = promise;
  }

  /**
   * Starts timer.
   * @returns {Promise} - timeout promise
   * @example
   * let timeout = new Timeout(2000); // 2 sec
   * timeout.start().catch(function(reason) {
   *     // timeout exceeded
   * });
   */
  start() {
    if (this[TIMEOUT] && !this[ID]) {
      this[ID] = setTimeout(() => {
        const error = new Error('Operation timeout exceeded');
        error.name = ERRORS.TIMEOUT;
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
