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

format string will be interpreted as below.

|expression|summary|example|
|:--|:--|:--|
|yyyy|year in 4 digits|2025|
|MM|month in 2 digits|01|
|dd|day in 2 digits|02|
|HH|hours in 2 digits|03|
|mm|minutes in 2 digits|04|
|ss|seconds in 2 digits|05|
|fff|milliseconds in 3 digits|006|


::: tip about default format
default format string is below

- `HH:mm:ss.fff`
:::
