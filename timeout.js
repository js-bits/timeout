const log = require('logger')(module)
let window = require('browser').window
let Promise = window.Promise || require('promise-polyfill')
let utils = require('utils')

let ERRORS = {
  TIMEOUT: 'TimeoutPromiseError',
  INITIALIZATION: 'TimeoutPromiseInitializationError'
}

/**
 * More convenient way to work with timeouts
 * @class
 * @param {number} timeout - number of milliseconds
 * @example
 * let timeout = new TimeoutPromise(1000); // 1 sec
 * timeout.start().catch(function(reason) {
 *     // timeout exceeded
 * });
 */
let TimeoutPromise = function (timeout) {
  let timeoutId
  let resolveTimeout
  let rejectTimeout
  let promise = new Promise(function (resolve, reject) {
    resolveTimeout = resolve
    rejectTimeout = reject
  })

  /**
   * Starts timer.
   * @returns {Promise} - timeout promise
   * @example
   * let timeout = new TimeoutPromise(2000); // 2 sec
   * timeout.start().catch(function(reason) {
   *     // timeout exceeded
   * });
   */
  this.start = function () {
    if (timeout && !timeoutId) {
      log.debug('start', timeout)
      timeoutId = window.setTimeout(function () {
        let error = new Error('Operation timeout exceeded')

        error.name = ERRORS.TIMEOUT
        rejectTimeout(error)
      }, timeout)
    }
    return promise
  }

  /**
   * Stops timer and resolves timeout promise.
   * @returns {Promise} - timeout promise
   */
  this.stop = function () {
    if (timeoutId) {
      log.debug('stop', timeout)
      window.clearTimeout(timeoutId)
      timeout = undefined
      timeoutId = undefined
      resolveTimeout()
    }
    return promise
  }

  /**
   * Additional way to catch error.
   * @example
   * let timeout = new TimeoutPromise(2000); // 2 sec
   * ...
   * timeout.start();
   * ...
   * timeout.catch(function(reason) {
   *     // timeout exceeded
   * });
   */
  this.catch = promise.catch.bind(promise)

  if (timeout === undefined) {
    resolveTimeout()
  } else if (!utils.isInteger(timeout) || timeout <= 0) {
    let error = new Error('Timeout value must be positive integer')

    error.name = ERRORS.INITIALIZATION
    rejectTimeout(error)
  } else {
    log.debug('created', timeout)
  }
}

TimeoutPromise.ERRORS = ERRORS

module.exports = TimeoutPromise
