---
outline: deep
---

# Container

We can use a container with `_spy.container` or `_spy.c`, and can feel free to put some data, functions, classes or so.


## setting items

We can set an item with `container.set()`.

``` js
_spy.container.set("some", "thing");

function hello() {
  console.log("world");
}

_spy.container.set("hello", hello);

class Some {
  get data() {
    return "some data";
  }
}

_spy.container.set("Some", Some);
```

## using items

We can use an item accessing by `_spy.container.[key]`.

``` js
console.log(_spy.c.some); // thing

_spy.c.hello(); // world

console.log(
  new _spy.c.Some().data
); // some data
```

## updating items

The tokens are required to update the items in the container. We can get the token as a return value of `container.set()`.

``` js
const token = _spy.c.set("isChanged", false);

console.log(_spy.c.isChanged); // false

_spy.c.set("isChanged", true, token);

console.log(_spy.c.isChanged); // true
```

## deleting items

We can delete an item with `container.delete()`.

``` js
const token = _spy.c.set("willBeRemoved", "dummy");

_spy.c.delete("willBeRemoved", token);
```

## shorthand alias

`_spy.c` is an alias of `_spy.container`, for shorthand. We can use both of them as mixed since that which of them is same with each other.

``` js
_spy.container.set("usingContainer", "usingContainer");
_spy.c.set("usingC", "usingC");

console.log(_spy.c.usingContainer);
console.log(_spy.container.usingC);
```

