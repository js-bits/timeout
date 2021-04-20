import { jest } from '@jest/globals';
import Timeout from './index.js';

const env = typeof window === 'undefined' ? 'node' : 'jsdom';

jest.useFakeTimers('modern');

const expectInitError = callback => {
  try {
    callback();
  } catch (error) {
    expect(error.name).toEqual('TimeoutInitializationError');
    expect(error.message).toEqual('Timeout value must be a positive integer');
  }
};

describe(`Timeout: \u001b[1;36m[${env}]`, () => {
  describe('#constructor', () => {
    test('should throw TimeoutInitializationError when timeout is undefined', () => {
      expect.assertions(2);
      expectInitError(() => {
        new Timeout();
      });
    });

    test('should throw TimeoutInitializationError when timeout is null', async () => {
      expect.assertions(2);
      expectInitError(() => {
        new Timeout(null);
      });
    });
    test('should throw TimeoutInitializationError when timeout is a number', async () => {
      expect.assertions(2);
      expectInitError(() => {
        new Timeout('3000');
      });
    });
    test('should throw TimeoutInitializationError when timeout is not a positive number', async () => {
      expect.assertions(2);
      expectInitError(() => {
        new Timeout(-12345);
      });
    });
  });

  describe('#set', () => {
    test('should return a timeout promise', async () => {
      const timeout = new Timeout(1);
      const promise = timeout.set();
      jest.clearAllTimers();
      return expect(promise).toBeInstanceOf(Promise);
    });
    test('should set a timer and reject when operation timeout exceeded', async () => {
      expect.assertions(2);
      const timeout = new Timeout(30000);
      const promise = timeout.set();
      jest.advanceTimersByTime(15000);
      timeout.set();
      jest.advanceTimersByTime(15000);
      return promise.catch(error => {
        expect(error.name).toEqual('TimeoutExceededError');
        expect(error.message).toEqual('Operation timeout exceeded');
      });
    });
  });

  describe('#clear', () => {
    test('should return a timeout promise', async () => {
      const timeout = new Timeout(30000);
      return expect(timeout.clear()).toBeInstanceOf(Promise);
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
      const promise = timeout.set();
      jest.advanceTimersByTime(40000);
      timeout.clear();
      return promise.catch(error => {
        expect(error.name).toEqual('TimeoutExceededError');
        expect(error.message).toEqual('Operation timeout exceeded');
      });
    });
  });
});
