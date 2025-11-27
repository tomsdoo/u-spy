---
outline: deep
---

# utils.deflate()

We can deflate objects with `_spy.utils.deflate()`.

``` js
_spy.utils.deflate({
  a: {
    b: 1,
  },
  c: [2, 3],
  d: {
    e: [
      { f: 4 },
      { g: 5 },
    ],
  },
});
/*
{
  "a.b": 1,
  "c[0]": 2,
  "c[1]": 3,
  "d.e[0].f": 4,
  "d.e[1].g": 5,
}
*/
```

``` ts
deflate(value: object): object;
```
