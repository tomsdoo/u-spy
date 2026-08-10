---
outline: deep
---

# utils.withRetry()

We can retry a function with `_spy.utils.withRetry()`.

``` js
let i = 0;
const result = await _spy.utils.withRetry(
  () => ++i,
  {
    shouldRetryResult(res) {
      return res % 2 !== 0;
    },
  },
);
console.log(result);
```

``` ts
withRetry<T>(
  fn: () => T | Promise<T>,
  options?: {
    maxAttempts?: number;
    delay?: number;
    shouldRetryResult?: (res: T) => boolean;
    shouldRetryError?: (err: Error) => boolean;
  };
): Promise<void>;
```
