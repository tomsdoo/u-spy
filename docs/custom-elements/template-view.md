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
  <div :text="value"></div>
  <button @click="increment">+</button>
  <button @click="decrement">-</button>
  <div :if="isZero" class="state">
    the value is 0
  </div>
  <div :if-not="isZero" class="state">
    the value is not 0
  </div>
</div>
${makeTag("style")}
.wrapper {
  .title {
    font-size: 1.2rem;
    text-align: center;
  }
  .state {
    font-size: 0.8rem;
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
    ];
    document.querySelector(
      `#${templateId.value}`
    ).eventHandlers = {
      increment(e, item, wholeItem, reflux) {
        reflux({
          ...wholeItem,
          value: wholeItem.value + 1,
        });
      },
      decrement(e, item, wholeItem, reflux) {
        reflux({
          ...wholeItem,
          value: wholeItem.value - 1,
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
];
document.querySelector("#my-template").eventHandlers = {
  increment(e, item, wholeItem, reflux) {
    reflux({
      ...wholeItem,
      value: wholeItem.value + 1,
    });
  },
  decrement(e, item, wholeItem, reflux) {
    reflux({
      ...wholeItem,
      value: wholeItem.value - 1,
    });
  },
};`;
</script>

# Template View

We can add a template-view with `_spy.customElement.ensureTemplateView()`.

``` js
_spy.customElement.ensureTemplateView();
```

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
