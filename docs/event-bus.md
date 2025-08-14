---
outline: deep
---

# Event Bus

We can listen and emit some events with `_spy.eventBus`.

``` js
function someEventHandler(data) {
  console.log("some-event", data);
}
function someEventHandlerOnce(data) {
  console.log("some-event once", data);
}

const SOME_EVENT = "some-event";
const OTHER_EVENT = "other-event";

_spy.eventBus.on(
  SOME_EVENT,
  someEventHandler,
);
_spy.eventBus.once(
  SOME_EVENT,
  someEventHandlerOnce,
);

_spy.eventBus.on(
  OTHER_EVENT,
  (data) => {
    console.log(OTHER_EVENT, data);
  },
);

_spy.stroke.register("some", () => {
  _spy.eventBus.emit(SOME_EVENT, {
    message: "hello",
  });
});

_spy.stroke.register("other", () => {
  _spy.eventBus.emit(OTHER_EVENT, {
    message: "other",
  });
});

_spy.stroke.register("remove", () => {
  _spy.eventBus.off(
    SOME_EVENT,
    someEventHandler,
  );
  console.log("removed a handler");
});

_spy.stroke.register("clear", () => {
  _spy.eventBus.clear(SOME_EVENT);
  console.log(`cleared ${SOME_EVENT}`);
});

_spy.stroke.register("clearall", () => {
  _spy.eventBus.clear();
  console.log("cleared all events");
});
```
