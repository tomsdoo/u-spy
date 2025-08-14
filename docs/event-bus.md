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

_spy.eventBus.on(
  SOME_EVENT,
  someEventHandler,
);
_spy.eventBus.once(
  SOME_EVENT,
  someEventHandlerOnce,
);

_spy.stroke.register("some", () => {
  _spy.eventBus.emit(SOME_EVENT, {
    message: "hello",
  });
});

_spy.stroke.register("remove", () => {
  _spy.eventBus.off(
    SOME_EVENT,
    someEventHandler,
  );
  console.log("removed a handler");
});
```
