# Promise-based timeout

A convenient, promise-based way to work with timeouts. It's useful to track asynchronous operations (HTTP requests for instance) latency.

## Installation

Install with npm:

```
npm install @js-bits/timeout
```

Install with yarn:

```
yarn add @js-bits/timeout
```

Import where you need it:

```javascript
import Timeout from '@js-bits/timeout';
```

or require for CommonJS:

```javascript
const Timeout = require('@js-bits/timeout');
```

## How to use

Basic approach:

```javascript
const timeout = new Timeout(1000); // 1 sec

timeout.set().catch(() => {
  console.log('Timeout exceeded');
});
```

Alternative approach:

```javascript
const timeout = new Timeout(2000); // 2 sec

timeout.catch(() => {
  console.log('Timeout exceeded');
});

// ...

timeout.set();
```

Error handling:

```javascript
const timeout = new Timeout(3000); // 3 sec

timeout.set().catch(reason => {
  if (reason.name === Timeout.TimeoutExceededError) {
    console.log('Timeout exceeded error');
  }
});
```

Actual usage:

```javascript
const timeout = new Timeout(1000); // 1 sec

timeout.catch(() => {
  // you can report the exceeded timeout here
  console.log('Asynchronous operation timeout exceeded');
});

// fake async operation
const asyncAction = async delay =>
  new Promise(resolve => {
    setTimeout(resolve, delay);
  });

(async () => {
  // at the beginning of the operation
  timeout.set();

  // perform some asynchronous actions which could potentially
  // take more time than the specified timeout
  const asyncActionPromise = asyncAction(2000); // 2 sec

  timeout.catch(() => {
    // you can also report the exceeded timeout or abort the operation here
  });

  await asyncActionPromise;

  // when the operation is completed
  timeout.clear();
})();
```

## Notes

- You cannot "pause" a timeout or "reset" it. Once it's set, there are only two possibilities: either the timeout can be manually cleared before it is exceeded or the timeout will be exceeded.
- It's possible to clear a timeout before it is even set up but you won't be able to set that timeout up ever again.
- Internet Explorer is not supported.
