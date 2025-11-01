---
outline: deep
---

# utils.prettierFormat()

We can load JS with `_spy.utils.prettierFormat()`.

``` js
await _spy.utils.prettierFormat(
  ".some { color: red; } .others { color: green; }",
  "css",
);
```

``` ts
prettierFormat(
  text: string,
  parser: string,
): Promise<string>;
```

::: warning about dependency
prettierFormat() depends on the condition of loading script since it will try to use prettier from CDN
:::
