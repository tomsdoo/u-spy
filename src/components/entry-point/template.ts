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
`;
