// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals';
import Timeout from './index.js';
// import Timeout from './dist/index.cjs';
// const Timeout = require('./dist/index.cjs');

jest.useFakeTimers();

const expectInitError = (/** @type {() => void} */ callback) => {
  try {
    callback();
  } catch (error) {
    expect(error.name).toEqual(Timeout.InitializationError);
    expect(error.message).toEqual('Timeout value must be a positive integer');
  }
};

describe('Timeout', () => {
  describe('#constructor', () => {
    test('should throw TimeoutInitializationError when timeout is undefined', () => {
      expect.assertions(2);
      expectInitError(() => {
        // @ts-expect-error ts(2554)
        new Timeout();
      });
    });

    test('should throw TimeoutInitializationError when timeout is null', async () => {
      expect.assertions(2);
      expectInitError(() => {
        // @ts-expect-error ts(2345)
        new Timeout(null);
      });
    });
    test('should throw TimeoutInitializationError when timeout is a number', async () => {
      expect.assertions(2);
      expectInitError(() => {
        // @ts-expect-error ts(2345)
        new Timeout('3000');
      });
    });
    test('should throw TimeoutInitializationError when timeout is not a positive number', async () => {
      expect.assertions(2);
      expectInitError(() => {
        new Timeout(-12345);
      });
    });

    test('should create an extended instance of Promise', () => {
      const timeout = new Timeout(1);
      expect(timeout).toBeInstanceOf(Promise);
      expect(timeout).toBeInstanceOf(Timeout);
      expect(String(timeout)).toEqual('[object Timeout]');
    });
  });

  describe('#set', () => {
    test('should return a timeout promise', () => {
      expect.assertions(3);
      const timeout = new Timeout(1);
      const promise = timeout.set();
      jest.clearAllTimers();
      expect(promise).toBeInstanceOf(Promise);
      expect(promise).toBeInstanceOf(Timeout);
      expect(promise).toBe(timeout);
    });
    test('should set a timer and reject when operation timeout exceeded', async () => {
      expect.assertions(2);
      const timeout = new Timeout(30000);
      const promise = timeout.set();
      jest.advanceTimersByTime(15000);
      timeout.set();
      jest.advanceTimersByTime(15000);
      return promise.catch(error => {
        expect(error.name).toEqual('Timeout|TimeoutExceededError');
        expect(error.message).toEqual('Operation timeout exceeded');
      });
    });
  });

  describe('#clear', () => {
    test('should return a timeout promise', () => {
      expect.assertions(3);
      const timeout = new Timeout(30000);
      jest.clearAllTimers();
      expect(timeout.clear()).toBeInstanceOf(Promise);
      expect(timeout.clear()).toBeInstanceOf(Timeout);
      expect(timeout.clear()).toBe(timeout);
    });
    test('should clear the timer and resolve timeout immediately', async () => {
      const timeout = new Timeout(30000);
      const promise = timeout.set();
      jest.advanceTimersByTime(1000);
      timeout.clear();
      jest.advanceTimersByTime(30000);
      return expect(promise).resolves.toBeUndefined();
    });
    test('should resolve timeout immediately when called before timeout has seted', async () => {
      const timeout = new Timeout(30000);
      const promise = timeout.clear();
      return expect(promise).resolves.toBeUndefined();
    });
    test('should just return the rejected promise when operation timeout exceeded', async () => {
      const timeout = new Timeout(30000);
      timeout.set();
      jest.advanceTimersByTime(40000);
      timeout.clear();
      return timeout.catch(error => {
        expect(error.name).toEqual('Timeout|TimeoutExceededError');
        expect(error.message).toEqual('Operation timeout exceeded');
      });
    });
  });

  test('Promise.race()', async () => {
    expect.assertions(1);
    const timeout = new Timeout(10);
    timeout.set();
    const promise1 = new Promise(() => {});
    jest.advanceTimersByTime(100);
    await expect(Promise.race([timeout, promise1])).rejects.toThrow('Operation timeout exceeded');
  });
});
