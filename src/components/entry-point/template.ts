import { name, version } from "@@/package.json";

export const template = `
${name}@${version}

<pre>
const CONTROL_ID = 'control-id';
const {
  receiver,
  restore,
} = _spy.intercept(CONTROL_ID);

receiver.on(receiver.events.XHR_LOAD, (data) => {
  console.log('xhr load', data);
});

receiver.on(receiver.events.FETCH, (data) => {
  console.log('fetch', data);
});
</pre>

<pre>
void _spy.intercept('mock-fetch', {
  fetchHandlers: [
    async function(url) {
      if (!/somedomain/i.test(url)) { return; }
      return new Response(JSON.stringify({
        message: 'hello',
      }));
    },
  ],
});
</pre>

<pre>
void _spy.intercept('control-id', {
  xhrHandlers: [
    async function ({ url }) {
      if (!/somedomain/i.test(url)) { return; }
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
    }
  ],
});
</pre>
`;
