# Promise-based timeout

A convenient, promise-based way to work with timeouts. It's useful to track asynchronous operations (AJAX requests for instance) latency.

## Installation

Install with npm:

```
npm install @js-bits/timeout -D
```

Install with yarn:

```
yarn add @js-bits/timeout -D
```

Import when you need it:

```javascript
import Timeout from '@js-bits/timeout';
```

## How to use

Basic approach:

```javascript
const timeout = new Timeout(1000); // 1 sec

timeout.start().catch(() => {
  console.log('Timeout exceeded');
});
```

Alternative approach:

```javascript
const timeout = new Timeout(3000); // 3 sec

timeout.catch(() => {
  console.log('Timeout exceeded');
});

...

timeout.start();
```

Error handling:

```javascript
const timeout = new Timeout(2000); // 2 sec

timeout.start().catch(reason => {
  if (reason.name === Timeout.ERRORS.TIMEOUT_EXCEEDED) {
    console.log('Timeout exceeded error');
  }
});
```

## Notes

You cannot "pause" a timeout or "restart" it. Once it's started, there are only two possibilities: either the timeout can be manually stopped before it is exceeded or the timeout will be exceeded.

It's possible to stop a timeout before it is even started but you won't be able to start that timeout ever again.
