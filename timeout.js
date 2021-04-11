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
const Timeout = function (timeout) {
  let timeoutId;
  let resolveTimeout;
  let rejectTimeout;
  const promise = new Promise((resolve, reject) => {
    resolveTimeout = resolve;
    rejectTimeout = reject;
  });

  /**
   * Starts timer.
   * @returns {Promise} - timeout promise
   * @example
   * let timeout = new Timeout(2000); // 2 sec
   * timeout.start().catch(function(reason) {
   *     // timeout exceeded
   * });
   */
  this.start = function () {
    if (timeout && !timeoutId) {
      timeoutId = setTimeout(() => {
        const error = new Error('Operation timeout exceeded');

        error.name = ERRORS.TIMEOUT;
        rejectTimeout(error);
      }, timeout);
    }
    return promise;
  };

  /**
   * Stops timer and resolves timeout promise.
   * @returns {Promise} - timeout promise
   */
  this.stop = function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeout = undefined;
      timeoutId = undefined;
      resolveTimeout();
    }
    return promise;
  };

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

  if (timeout === undefined) {
    resolveTimeout();
  } else if (!Number.isInteger(timeout) || timeout <= 0) {
    const error = new Error('Timeout value must be a positive integer');

    error.name = ERRORS.INITIALIZATION;
    rejectTimeout(error);
  } else {
    // log.debug('created', timeout);
  }
};

Timeout.ERRORS = ERRORS;

export default Timeout;
