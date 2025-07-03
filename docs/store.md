---
outline: deep
---

# Store

We can use some stores with `_spy.ensureStore()`.

``` js
const myStore = _spy.ensureStore("my-store");

store.some = "thing";
console.log(store.some); // thing
```

## Callback to observe the changes of the store

We can register the callbacks to observe the changes of the store.

``` js
store.onChange((prop, value) => {
  console.log(`${prop}: ${value}`);
});
store.another = "test"; // "another: test" will be output on console
```

And we can unregister it.

``` js
function log(prop, value) {
  console.log(`${prop}: ${value}`);
}

store.onChange(log);
store.test = 1; // console.log

store.offChange(log);
store.test = 2; // no console.log
```
