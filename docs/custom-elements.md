---
outline: deep
---

# Custom Elements

We can add the simple declarative custom elements with `_spy.customElement.ensure()`.

``` js
_spy.customElement.ensure(
  "my-element",
  {
    templateHtml: `
    <div>
      <span :value="name"></span>
      <p :value="message"></p>
    </div>
    <style>
    div {
      background: yellow;
      color: red;
      span {
        background: green;
        color: blue;
      }
    }
    :host(.gray) {
      div {
        background: gray;
      }
    }
    </style>
    `,
  },
);
```

``` html
<my-element name="alice" message="hit is a test"></my-element>
<my-element class="gray" name="bob" message="hello world"></my-element>
```

## `:value` attribute in template HTML

The attribute named `:value` indicates a reactive text content property.

``` js
_spy.customElement.ensure(
  "just-div",
  {
    templateHtml: `<div :value="some"></div>`,
  },
);
```


`<just-div some="thing"></just-div>` will render `<div>thing</div>` in the custom element.

And we can change the value via `boundData` property of them.

``` js
document.querySelector("just-div").boundData.some = "other";
```

## `@[event]` attribute in template HTML

The attribute that name starts with `@` will invoke the handler.

``` js
_spy.customElement.ensure(
  "my-form",
  {
    templateHtml: `
      <div>
        <button type="button" @click="work">
          click me
        </button>
      </div>
    `,
    eventHandlers: {
      work(e) {
        console.log(e.target.textContent);
      },
    },
  },
);
```
