---
outline: deep
---

# utils.download()

We can download some data with `_spy.utils.download()`.

``` js
_spy.utils.download({
  data: "content",
  filename: "data.txt",
});
```

``` ts
download(p: {
  data: string | object;
  filename: string;
}): void;
```
