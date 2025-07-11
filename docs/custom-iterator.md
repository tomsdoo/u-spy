---
outline: deep
---

# Custom Iterator

We can add the simple custom iterator that has the interoperability with custom elements, by using `_spy.ensureCustomIterator()`.

``` js
_spy.ensureCustomElement(
  "person-info",
  {
    templateHtml: `<span :value="name"></span>`,
  },
);
_spy.ensureCustomIterator();
```
``` html
<custom-iterator id="persons" items="[]">
  <span>person:</span>
  <person-info></person-info>
  <span>friend:</span>
  <person-info :item="item.friends[0]"></person-info>
</custom-iterator>
<script>
  document.querySelector("#persons").items = [
    {
      name: "alice",
      friends: [{ name: "charlie" }],
    },
    {
      name: "bob",
      friends: [{ name: "david" }],
    },
  ];
</script>
```

