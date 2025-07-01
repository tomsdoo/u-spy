---
outline: deep
---

# Mockings

We can mock fetch/XMLHttpRequest with `_spy.intercept()`.

## mocking fetch

``` js
void _spy.intercept('some-id', {
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

## mocking XMLHttpRequest

``` js
void _spy.intercept('some-id', {
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

## mocking both

``` js
void _spy.intercept("some-id", {
  fetchHandlers: [
    async () => new Response(JSON.stringify({ status: "ok" })),
  ],
  xhrHandlers: [
    async () => ((responseBody) => ({
      response: JSON.stringify(responseBody),
      responseText: JSON.stringify(responseBody),
      responseHeaders: {
        "Content-Type": "application/json",
      },
      responseXML: null,
    }))({ status: "ok" }),
  ],
});
```