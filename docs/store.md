---
outline: deep
---

# Store

We can use some stores with `_spy.store`.

``` js
const myStore = _spy.store.ensure("my-store");

myStore.some = "thing";
console.log(myStore.some); // thing
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
