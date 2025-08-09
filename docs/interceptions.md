---
outline: deep
---

# Interceptions

We can intercept `fetch`/`XMLHttpRequest`/`beacon`/`window message` with `_spy.intercept()`.

``` js
const {
  receiver,
  restore,
} = _spy.intercept("some-id");
```

## intercepting fetch

``` js
receiver.on(
  receiver.events.FETCH,
  (data) => {
    console.log("fetch", data);
  },
);
```

## intercepting XMLHttpRequest load

``` js
receiver.on(
  receiver.events.XHR_LOAD,
  (data) => {
    console.log("xhr load", data);
  },
);
```

## intercepting sendBeacon

``` js
receiver.on(
  receiver.events.BEACON,
  (data) => {
    console.log("beacon", data);
  },
);
```

## intercepting windowMessage

``` js
receiver.on(
  receiver.events.WINDOW_MESSAGE,
  (data) => {
    console.log("window message", data);
  },
);
```
