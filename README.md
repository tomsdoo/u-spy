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

receiver.on(
  receiver.events.WINDOW_MESSAGE,
  (data) => {
    console.log('window message', data);
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

## Event Bus

``` js
function someEventHandler(data) {
  console.log("some-event", data);
}

const SOME_EVENT = "some-event";

_spy.eventBus.on(
  SOME_EVENT,
  someEventHandler,
);

_spy.eventBus.emit(SOME_EVENT, {
  message: "hello",
});
```

## container

``` js
_spy.container.set("some", "thing");

_spy.c.some // thing
```

## custom elements

``` js
_spy.customElement.ensure("my-element", { templateHtml: `
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
