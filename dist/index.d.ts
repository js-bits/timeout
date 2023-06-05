export default Timeout;
/**
 * Rejects the promise with an error if it does not settle within a specified timeout
 * @class
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
     * Creates new `Timeout` instance.
     * @param {number} timeout - number of milliseconds
     * @throws {typeof Timeout.InitializationError}
     * @throws {typeof Timeout.TimeoutExceededError}
     */
    constructor(timeout: number);
    /**
     * Initiates a timer for the specified timeout
     * @returns {this} - timeout promise
     * @throws {typeof Timeout.TimeoutExceededError}
     */
    set(): this;
    /**
     * Clears the timeout and resolves the timeout promise
     * @returns {this} - timeout promise
     */
    clear(): this;
}
import ExtendablePromise from "@js-bits/xpromise";
