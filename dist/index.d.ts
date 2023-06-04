export default Timeout;
/**
 * Rejects the promise with an error if it does not settle within a specified timeout
 * @class
 * @param {Number} timeout - number of milliseconds
 * @extends {ExtendablePromise<undefined>}
 */
declare class Timeout extends ExtendablePromise<undefined> {
    /**
     * @type {'Timeout|InitializationError'}
     * @readonly
     */
    static readonly InitializationError: 'Timeout|InitializationError';
    /**
     * @type {'Timeout|TimeoutExceededError'}
     * @readonly
     */
    static readonly TimeoutExceededError: 'Timeout|TimeoutExceededError';
    /**
     *
     * @param {number} timeout
     * @throws {typeof Timeout.InitializationError}
     * @throws {typeof Timeout.TimeoutExceededError}
     */
    constructor(timeout: number);
    /**
     * Initiates a timer for the specified timeout
     * @returns {Timeout} - timeout promise
     * @throws {typeof Timeout.TimeoutExceededError}
     */
    set(): Timeout;
    /**
     * Clears the timeout and resolves the timeout promise
     * @returns {Timeout} - timeout promise
     */
    clear(): Timeout;
}
import ExtendablePromise from "@js-bits/xpromise";
