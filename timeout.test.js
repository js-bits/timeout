import { jest } from '@jest/globals';
import Timeout from './timeout.js';

jest.useFakeTimers('modern');

const expectInitError = async timeout => {
  expect.assertions(2);
  try {
    await timeout.start();
  } catch (error) {
    expect(error.name).toEqual('TimeoutInitializationError');
    expect(error.message).toEqual('Timeout value must be a positive integer');
  }
};

describe('Timeout', () => {
  describe('#constructor', () => {
    test('should resolve immediately immediately after start when timeout is undefined', async () => {
      const timeout = new Timeout();
      return expect(timeout.start()).resolves.toBeUndefined();
    });

    test('should reject immediately after start when timeout is null', async () => {
      expectInitError(new Timeout(null));
    });
    test('should reject immediately after start when timeout is a number', async () => {
      expectInitError(new Timeout('3000'));
    });
    test('should reject immediately after start when timeout is a positive number', async () => {
      expectInitError(new Timeout(-12345));
    });
  });

  describe('#start', () => {
    test('should return a timeout promise', async () => {
      const timeout = new Timeout();
      return expect(timeout.start()).toBeInstanceOf(Promise);
    });
    test('should start a timer and reject when operation timeout exceeded', async () => {
      expect.assertions(2);
      const timeout = new Timeout(30000);
      const promise = timeout.start();
      jest.advanceTimersByTime(30000);
      return promise.catch(error => {
        expect(error.name).toEqual('TimeoutError');
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
