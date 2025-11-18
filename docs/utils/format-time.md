---
outline: deep
---

# utils.formatTime()

We can format time with `_spy.utils.formatTime()`.

``` js
_spy.utils.formatTime(new Date());
```

``` ts
formatTime(
  dateValue: Date,
  format?: string,
): string;
```

::: warning about format
formatTime() currently supports below as format string

- `HH:mm:ss.fff`
- `yyyy/MM/dd HH:mm:ss.fff`
:::
