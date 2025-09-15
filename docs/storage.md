---
outline: deep
---

# Storage

We can use a localStorage proxy with `_spy.storage`. `uss_` prefix will be added to each key using `_spy.storage`.

## set and get

We can set and get the values.

``` js
_spy.storage.some = "data";
_spy.storage.some // data
```

## deleting keys

We can delete the key.

``` js
_spy.storage.delete("some");
```
