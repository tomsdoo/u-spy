import { name, version } from "@@/package.json";

export const template = `
${name}@${version}

<pre>
const CONTROL_ID = 'control-id';
const {
  receiver,
  restore,
} = _easySpy.intercept(CONTROL_ID);

receiver.on(receiver.events.XHR_LOAD, (data) => {
  console.log('xhr load', data);
});

receiver.on(receiver.events.FETCH, (data) => {
  console.log('fetch', data);
});
</pre>
`;
