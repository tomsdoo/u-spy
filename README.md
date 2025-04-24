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
    async function(url) {
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
    async function ({ url }) {
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

