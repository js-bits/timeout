import { jest } from '@jest/globals';
import Timeout from './timeout.js';

jest.useFakeTimers('modern');

const expectInitError = callback => {
  try {
    callback();
  } catch (error) {
    expect(error.name).toEqual('TimeoutInitializationError');
    expect(error.message).toEqual('Timeout value must be a positive integer');
  }
};

describe('Timeout', () => {
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

  describe('#start', () => {
    test('should return a timeout promise', async () => {
      const timeout = new Timeout(1);
      const promise = timeout.start();
      jest.clearAllTimers();
      return expect(promise).toBeInstanceOf(Promise);
    });
    test('should start a timer and reject when operation timeout exceeded', async () => {
      expect.assertions(2);
      const timeout = new Timeout(30000);
      const promise = timeout.start();
      jest.advanceTimersByTime(30000);
      return promise.catch(error => {
        expect(error.name).toEqual('TimeoutExceededError');
        expect(error.message).toEqual('Operation timeout exceeded');
      });
    });
  });

  describe('#stop', () => {
    test('should return a timeout promise', async () => {
      const timeout = new Timeout(30000);
      return expect(timeout.stop()).toBeInstanceOf(Promise);
    });
    test('should stop the timer and resolve timeout immediately', async () => {
      const timeout = new Timeout(30000);
      const promise = timeout.start();
      jest.advanceTimersByTime(1000);
      timeout.stop();
      jest.advanceTimersByTime(30000);
      return expect(promise).resolves.toBeUndefined();
    });
  });
});
