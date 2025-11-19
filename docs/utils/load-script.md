---
outline: deep
---

# utils.loadScript()

We can load JS with `_spy.utils.loadScript()`.

``` js
await _spy.utils.loadScript("https://cdn.jsdelivr.net/npm/u-spy");
```

``` ts
loadScript(
  src: string,
  options?: {
    type?: string;
  },
): Promise<string>;
```
