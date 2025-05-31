# u-spy

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
} = _spy.registerHotStroke("hello", () => {
  console.log("world");
  unregisterHotStroke();
});
```

## displayDialog()

``` js
const {
  unregisterHotStroke,
} = _spy.registerHotStroke("hello", () => {
  _spy.displayDialog(dialogElement => {
    dialogElement.textContent = "world";
  });
  unregisterHotStroke();
});
```

## change hot strokes that've been set as default

``` js
// spy -> myspy
_spy.changeHotStrokeSpy("myspy");
// style -> mystyle
_spy.changeHostStrokeStyle("mystyle");
```

## unregister hot strokes that've been set as default

``` js
_spy.unregisterHotStroke();
```
