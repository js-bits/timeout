const ERRORS = {
  TIMEOUT: 'TimeoutError',
  INITIALIZATION: 'TimeoutInitializationError',
};

/**
 * More convenient way to work with timeouts
 * @class
 * @param {number} timeout - number of milliseconds
 * @example
 * let timeout = new Timeout(1000); // 1 sec
 * timeout.start().catch(function(reason) {
 *     // timeout exceeded
 * });
 */
class Timeout {
  constructor(timeout) {
    this.timeout = timeout;
    // this.timeoutId;
    // this.resolveTimeout;
    // this.rejectTimeout;
    this.promise = new Promise((resolve, reject) => {
      this.resolveTimeout = resolve;
      this.rejectTimeout = reject;
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
    this.catch = this.promise.catch.bind(this.promise);

    if (timeout === undefined) {
      this.resolveTimeout();
    } else if (!Number.isInteger(timeout) || timeout <= 0) {
      const error = new Error('Timeout value must be a positive integer');

      error.name = ERRORS.INITIALIZATION;
      this.rejectTimeout(error);
    } else {
      // log.debug('created', timeout);
    }
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
    if (this.timeout && !this.timeoutId) {
      this.timeoutId = setTimeout(() => {
        const error = new Error('Operation timeout exceeded');

        error.name = ERRORS.TIMEOUT;
        this.rejectTimeout(error);
      }, this.timeout);
    }
    return this.promise;
  }

  /**
   * Stops timer and resolves timeout promise.
   * @returns {Promise} - timeout promise
   */
  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeout = undefined;
      this.timeoutId = undefined;
      this.resolveTimeout();
    }
    return this.promise;
  }
}

Timeout.ERRORS = ERRORS;

export default Timeout;
