# u-spy

![npm](https://img.shields.io/npm/v/u-spy?style=for-the-badge&logo=npm)
![NPM](https://img.shields.io/npm/l/u-spy?style=for-the-badge&logo=npm)

![ci](https://img.shields.io/github/actions/workflow/status/tomsdoo/u-spy/ci.yml?style=social&logo=github)
![checks](https://img.shields.io/github/check-runs/tomsdoo/u-spy/main?style=social&logo=github)
![top language](https://img.shields.io/github/languages/top/tomsdoo/u-spy?style=social&logo=typescript)
![Maintenance](https://img.shields.io/maintenance/yes/2025?style=social&logo=github)

## installation

loading from CDN

``` html
<script src="https://cdn.jsdelivr.net/npm/u-spy"></script>
```

see also [documentation](https://tomsdoo.github.io/u-spy/)

## logging

``` js
const {
  receiver,
  restore,
} = _spy.intercept('control-id');

receiver.on(
  receiver.events.XHR_LOAD,
  (data) => {
    console.log('xhr load', data);
  },
);

receiver.on(
  receiver.events.FETCH,
  (data) => {
    console.log('fetch', data);
  },
);

receiver.on(
  receiver.events.BEACON,
  (data) => {
    console.log('beacon', data);
  },
);
```

## intercepting

``` js
void _spy.intercept('control-id', {
  fetchHandlers: [
    async function(url, init, originalFetch) {
      if (!/somedomain/i.test(url)) {
        return;
      }
      return new Response(JSON.stringify({
        message: 'hello',
      }));
    },
  ],
});
```

``` js
void _spy.intercept('control-id', {
  xhrHandlers: [
    async function ({ url }, originalXmlHttpRequest) {
      if (!/somedomain/i.test(url)) {
        return;
      }
      const responseBody = {
        message: 'hello from xhr handler',
      };
      return {
        response: JSON.stringify(responseBody),
        responseText: JSON.stringify(responseBody),
        responseHeaders: {
          'Content-Type': 'application/json',
        },
        responseURL: 'https://somedomain',
        responseXML: null,
      };
    },
  ],
});
```

## hot stroke

``` js
const {
  unregisterHotStroke,
} = _spy.stroke.register("hello", () => {
  console.log("world");
  unregisterHotStroke();
});
```

## display dialog

``` js
const {
  unregisterHotStroke,
} = _spy.stroke.register("hello", () => {
  _spy.dialog.display(dialogElement => {
    dialogElement.textContent = "world";
  });
  unregisterHotStroke();
});
```

## change hot strokes that've been set as default

``` js
// spy -> myspy
_spy.stroke.replace("spy", "myspy");

// style -> mystyle
_spy.stroke.replace("style", "mystyle");
```

## unregister all hot strokes

``` js
_spy.stroke.unregisterAll();
```

## store

``` js
const store = _spy.store.ensure("my-store");
store.some = "thing";
console.log(store.some); // thing

function logChange(prop, value) {
  console.log(`${prop}: ${value}`);
}

store.onChange(logChange);

store.another = "test"; // "another: test" will be output on console

store.offChange(logChange);
store.another = "test2"; // no output on console because the callback had been off
```

## custom elements

``` js
_spy.ensureCustomElement("my-element", { templateHtml: `
<div>
  hi
  <span :value="name"></span>
  <p :value="message"></p>
</div>
<style>
:host(.gray) {
  div {
    background: gray;
  }
}
div {
  background: yellow;
  color: red;
  span {
    background: green;
    color: blue;
  }
}
</style>
`});

```
``` html
<my-element name="alice" message="this is a test"></my-element>
<my-element name="bob" class="gray"></my-element>
```

## iteraion of custom elements

``` js
_spy.ensureCustomElement("person-info", {
  templateHtml: `
  <div>
    <span :value="name"></span>
    <span :value="message"></span>
  </div>
  `,
});
_spy.ensureCustomIterator();
```
``` html
<custom-iterator id="persons" items="[]">
  <person-info></person-info>
  <span>friend: </span><person-info :item="item.friends[0]"></person-info>
</custom-iterator>
<script>
  document.querySelector("#persons").items = [
    {
      name: "alice",
      message: "hi",
      friends: [
        { name: "charlie", message: "a friend"},
      ]
    },
    {
      name: "bob",
      message: "hello",
      friends: [
        { name: "david", message: "hey" }
      ]
    },
  ];
</script>
```
