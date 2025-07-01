---
outline: deep
---

# Getting started

loading from CDN

``` html
<script src="https://"></script>
```

## logging

``` js
const {
  receiver,
  restore,
} = _spy.intercept("some-id");

receiver.on(
  receiver.events.XHR_LOAD,
  (data) => {
    console.log("xhr load", data);
  },
);

receiver.on(
  receiver.events.FETCH,
  (data) => {
    console.log("fetch", data);
  },
);

receiver.on(
  receiver.events.BEACON,
  (data) => {
    console.log("beacon", data);
  },
);
```

