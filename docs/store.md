---
outline: deep
---

# Store

We can use some stores with `_spy.store`.

``` js
// in a block
{
  const store = _spy.store.ensure("my-store");
  store.some = "thing";

  function logChange(prop, value) {
    console.log(`${prop}: ${value}`);
    store.offChange(logChange);
  }
  store.onChange(logChange);
}

// in another block
{
  _spy.store.ensure("my-store").another = "test"; // "another: test" will be output on console

  _spy.store.ensure("my-store").another = "test2"; // no output on console because the callback had been off
}
```

## Callback to observe the changes of the store

We can register the callbacks to observe the changes of the store.

``` js
myStore.onChange((prop, value) => {
  console.log(`${prop}: ${value}`);
});
myStore.another = "test"; // "another: test" will be output on console
```

And we can unregister it.

``` js
function log(prop, value) {
  console.log(`${prop}: ${value}`);
}

myStore.onChange(log);
myStore.test = 1; // console.log

myStore.offChange(log);
myStore.test = 2; // no console.log
```

## get store ids

``` js
console.log(_spy.store.keys); // ["my-store", "another-store"]
```
