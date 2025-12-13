---
outline: deep
---

<script setup>
import { computed, ref, watch, onMounted, useTemplateRef } from "vue";

function createTemplateId() {
  return `template-${crypto.randomUUID().replace(/-/,'')}`;
}

const canPlay = ref(false);
const resultAreaElement = useTemplateRef("result-area");
const templateId = ref(createTemplateId());

function makeTag(tagName, isEnd) {
  return `<${isEnd ? "/" : ""}${tagName}>`;
}
const defaultCodeText = `<div class="wrapper">
  <div class="title" :text="title"></div>
  <form>
    <div :text="value" class="value" :class="{ negative: isNegative }"></div>
    <button type="button" @click="increment">+</button>
    <button type="button" @click="decrement">-</button>
  </form>
  <div :if-equal="value" :equal-value="3">it's 3</div>
  <div :if="isZero" class="state">
    the value is 0
  </div>
  <div :if-equal="valueState" :equal-value="positive">positive</div>
  <div :if-equal="valueState" :equal-value="negative">negative</div>
  <ul class="log-list">
    <li :for="logRecords">
      <div :text="time"></div>
      <div :text="previous"></div>
      ->
      <div :text="current"></div>
    </li>
  </ul>
</div>
${makeTag("style")}
.wrapper {
  .title {
    font-size: 1.2rem;
    text-align: center;
  }
  form {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 0.5em;
    .value {
      color: green;
    }
    .value.negative {
      color: red;
    }
    button {
      cursor: pointer;
    }
  }
  .state {
    font-size: 0.8rem;
  }
  .log-list {
    li {
      display: grid;
      grid-template-columns: 1fr auto auto auto;
      gap: 1em;
    }
  }
}
${makeTag("style", true)}
`;
const codeText = ref(defaultCodeText);

const _valueJsonText = ref(JSON.stringify({
  title: "sample counter",
  value: 0,
}, null, 2));
const valueJsonText = computed({
  get() {
    return _valueJsonText.value;
  },
  set(v) {
    try {
      _valueJsonText.value = JSON.stringify(
        JSON.parse(v),
        null,
        2,
      );
    } catch {}
  },
});

watch(
  [codeText, resultAreaElement],
  ([codeText,resultAreaElement]) => {
    if (resultAreaElement == null) {
      return;
    }
    templateId.value = createTemplateId();
    resultAreaElement.innerHTML = "";
    resultAreaElement.appendChild(
      document
        .createRange()
        .createContextualFragment(
          `<template-view id="${
            templateId.value
          }">${
            codeText
          }</template-view>`
        )
    );
    document.querySelector(
      `#${templateId.value}`
    ).item = JSON.parse(valueJsonText.value);
    document.querySelector(`#${templateId.value}`).reducers = [
      (item) => ({
        ...item,
        isZero: item.value === 0,
      }),
      (item) => {
        const valueState = item.isZero
          ? "zero"
          : item.value > 0
            ? "positive"
            : "negative";
        return {
          ...item,
          valueState,
        };
      },
      (item) => ({
        ...item,
        isNegative: item.valueState === "negative",
      }),
      (item) => {
        const { logRecord, ...rest } = item;
        return {
          ...rest,
          logRecords: [
            ...(item.logRecords ?? []),
            ...(logRecord ? [logRecord] : []),
          ],
        };
      },
    ];
    function makeLogRecord(previous, current) {
      return {
        time: new Date(),
        previous,
        current,
      };
    }
    document.querySelector(
      `#${templateId.value}`
    ).eventHandlers = {
      increment(e, item, wholeItem, reflux) {
        const nextValue = wholeItem.value + 1;
        reflux({
          ...wholeItem,
          value: nextValue,
          logRecord: makeLogRecord(wholeItem.value, nextValue),
        });
      },
      decrement(e, item, wholeItem, reflux) {
        const nextValue = wholeItem.value - 1;
        reflux({
          ...wholeItem,
          value: nextValue,
          logRecord: makeLogRecord(wholeItem.value, nextValue),
        });
      },
    };
  },
  {
    immediate: true,
  },
);

watch(valueJsonText, (valueJsonText) => {
  const tv = document.querySelector(
    `#${templateId.value}`,
  );
  if (tv == null) {
    return;
  }
  tv.item = JSON.parse(valueJsonText);
});

onMounted(() => {
  const scriptUrl = "https://cdn.jsdelivr.net/npm/u-spy";
  const existingScript = document
    .head
    .querySelector(`script[src="${scriptUrl}"]`);
  if (existingScript != null) {
    canPlay.value = true;
    return;
  }
  const scriptTag = document.createElement("script");
  scriptTag.addEventListener("load", () => {
    _spy.customElement.ensureTemplateView();
    canPlay.value = true;
  });
  scriptTag.src = scriptUrl;
  document.head.appendChild(scriptTag);
});


const dummyScriptText = `document.querySelector("#my-template").reducers = [
  (item) => ({
    ...item,
    isZero: item.value === 0,
  }),
  (item) => {
    const valueState = isZero
      ? "zero"
      : item.value > 0
        ? "positive"
        : "negative";
    return {
      ...item,
      valueState,
    };
  },
  (item) => ({
    ...item,
    isNegative: item.valueState === "negative",
  }),
  (item) => {
    const { logRecord, ...rest } = item;
    return {
      ...rest,
      logRecords: [
        ...(item.logRecords ?? []),
        ...(logRecord ? [logRecord] : []),
      ],
    };
  },
];
function makeLogRecord(previous, current) {
  return {
    time: new Date(),
    previous,
    current,
  };
}
document.querySelector("#my-template").eventHandlers = {
  increment(e, item, wholeItem, reflux) {
    const nextValue = wholeItem.value + 1;
    reflux({
      ...wholeItem,
      value: nextValue,
      logRecord: makeLogRecord(wholeItem.value, nextValue),
      ],
    });
  },
  decrement(e, item, wholeItem, reflux) {
    const nextValue = wholeItem.value - 1;
    reflux({
      ...wholeItem,
      value: nextValue,
      logRecord: makeLogRecord(wholeItem.value, nextValue),
    });
  },
};`;
</script>

# Template View

We can add a template-view with `_spy.customElement.ensureTemplateView()`.

``` js
_spy.customElement.ensureTemplateView();
```

::: info or, execute from CDN

js file for just template-view will be delivered too, since v0.32.0.  
loading script from CDN will automatically execute `ensureTemplateView()`.  
and it's only for template-view so that window will not have `_spy` for that case.

``` html
<script src="https://cdn.jsdelivr.net/npm/u-spy/dist/template-view.global.js"></script>
```
:::


``` html
<template-view id="my-template-view">
  <div class="my-element" :text="name"></div>
  <style>
    .my-element {
      color: blue;
    }
  </style>
</template-view>
<script>
  document
    .querySelector("#my-template-view")
    .item = {
      name: "alice",
    };
</script>
```

### directives

the available directives are below.

| |example|description|
|:--|:--|:--|
:if|`<div :if="name">`|renders if the value of property is truthy|
:if-not|`<div :if-not="name">`|renders if the value of property is falsy|
:if-equal|`<div :if="name" :equal-value="Alice">`|renders if the value of property is equal to expected value|
:if-not-equal|`<div :if-not-equal="name" :equal-value="Alice">`|renders if the value of property is not equal to expected value|
:text|`<div :text="name">`|renders the value of property as textContent|
:value|`<input :value="name">`|sets the value of property as value|
:for|`<li :for="items"><div :text="name"></div></li>`|renders the items of the array|
@[event]|`<button @click="onClick"></button>`|registers the event handler in eventHandlers of template-view|
:class|`<div :class="{ red: isRed, blue: isBlue }">`|adds some classes|



<template v-if="canPlay">
  <h3>Playground</h3>
  <section class="playground">
    <div class="titled-box">
      <div>input</div>
      <div class="box">
        <div>&lt;script&gt;</div>
        <div>_spy.customElement.ensureTemplateView();</div>
        <div>&lt;/script&gt;</div>
        <div>&lt;template-view id="my-template"&gt;</div>
        <textarea v-model="codeText"></textarea>
        <div>&lt;/template-view&gt;</div>
        <div>&lt;script&gt;</div>
        <div>document.querySelector("#my-template").item = JSON.parse(`</div>
        <textarea v-model="valueJsonText"></textarea>
        <div>`);</div>
        <pre v-html="dummyScriptText"></pre>
        <div>&lt;/script&gt;</div>
      </div>
    </div>
    <div class="titled-box">
      <div>result</div>
      <div class="box">
        <div ref="result-area" class="result-area"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.playground {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;

  .titled-box {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 1rem;
    padding: 1rem;
    box-shadow: 0 0 1px;
    overflow-x: auto;

    > div:nth-child(1) {
      font-size: 1.2em;
    }

    .box {
      padding: 1em;
      div {
        font-size: 0.8rem;
        line-height: 1.2;
      }
      pre {
        font-size: 0.8rem;
        line-height: 1.2;
      }
    }
  }
}
textarea {
  display: block;
  width: calc(100% - 2em);
  margin: 1em auto;
  height: 20em;
  line-height: 1;
  outline: 1px dotted;
  outline-offset: 0.5em;
}
.result-area {
}
</style>
