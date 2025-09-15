---
outline: deep
---

# Hot Strokes

We can register the handlers for the key strokes with `_spy.stroke.register()`.
``` js
const {
  unregisterHotStroke,
} = _spy.stroke.register("hello", () => {
  console.log("world");
  unregisterHotStroke();
});
```

## Hot Strokes that've been set as default

|#|stroke|what will happen|
|--:|:--|:--|
|1|spy|shows spy log dialog|
|2|style|shows ad hoc style editor|
|3|code|shows ad hoc code editor|

### How to change the hot strokes

we can use `_spy.stroke.replace()` to change the strokes.

``` js
// spy -> myspy
_spy.stroke.replace("spy", "myspy");

// style -> mystyle
_spy.stroke.replace("style", "mystyle");
```

### How to unregister all hot strokes

``` js
_spy.stroke.unregisterAll();
```

### How to get the registered hot strokes

``` js
_spy.stroke.keys
// ["spy", "style", "somestroke"]
```

### How to unregister a specified hot stroke

``` js
_spy.stroke.unregister("style");
```

### stroke interface

``` ts
interface Spy {
  stroke: {
    keys: string[];
    register(stroke: string, handler: () => void): { unregisterHotStroke };
    unregister(stroke: string): void;
    unregisterAll(): void;
    replace(beforeStroke: string, afterStroke: string): { unregisterHotStroke } | null;
  };
}
```
