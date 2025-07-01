---
outline: deep
---

# Hot Strokes

We can register the handlers for the key strokes with `_spy.registerHotStroke()`.
``` js
const {
  unregisterHotStroke,
} = _spy.registerHotStroke("hello", () => {
  console.log("world");
  unregisterHotStroke();
});
```

## Hot Strokes that've been set as default

|#|stroke|what will happen|
|--:|:--|:--|
|1|spy|shows spy log dialog|
|2|style|shows ad hoc style editor|

### How to change the default hot strokes

`_spy` has the methods to change the strokes.

``` js
// spy -> myspy
_spy.changeHotStrokeSpy("myspy");

// style -> mystyle
_spy.changeHostStrokeStyle("mystyle");
```

### How to unregister the default hot strokes

``` js
_spy.unregisterHotStroke();
```
