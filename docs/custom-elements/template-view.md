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
  <div :text="person.name"></div>
  <div class="team" :text="team.name"></div>
</div>
${makeTag("style")}
:host {
  color: green;
}
.wrapper {
  .team {
    color: red;
  }
}
${makeTag("style", true)}
`;
const codeText = ref(defaultCodeText);

const _valueJsonText = ref(JSON.stringify({
  person: {
    name: "alice",
  },
  team: {
    name: "team A",
  },
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
    ).value = JSON.parse(valueJsonText.value);
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
  tv.value = JSON.parse(valueJsonText);
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
</script>

# Template View

We can add a template-view with `_spy.customElement.ensureTemplateView()`.

``` js
_spy.customElement.ensureTemplateView();
```

``` html
<template-view id="my-template-view">
  <div class="wrapper">
    <div class="person">
      <div class="name" :text="person.name"></div>
    </div>
    <div class="team">
      <div class="name" :text="team.name"></div>
    </div>
  </div>
  <style>
    :host {
      color: red;
      background: green;
    }
    .wrapper {
      display: grid;
      grid-template-columns: repeat(2, auto);
      .team {
        .name {
          color: blue;
        }
      }
    }
  </style>
</template-view>
<script>
  document
    .querySelector("#my-template-view")
    .value = {
      person: {
        name: "alice",
      },
      team: {
        name: "team A",
      },
    };
</script>
```

<template v-if="canPlay">
  <h3>Playground</h3>
  <section class="playground">
    <div class="titled-box">
      <div>input</div>
      <div class="box">
        <div>&lt;template-view id="my-template"&gt;</div>
        <textarea v-model="codeText"></textarea>
        <div>&lt;/template-view&gt;</div>
        <div>&lt;script&gt;</div>
        <div>document.querySelector("#my-template").value = JSON.parse(`</div>
        <textarea v-model="valueJsonText"></textarea>
        <div>`);</div>
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

    > div:nth-child(1) {
      font-size: 1.2em;
    }

    .box {
      padding: 1em;
      div {
        font-size: 0.8rem;
        line-height: 1.2;
      }
    }
  }
}
textarea {
  display: block;
  width: calc(100% - 2em);
  margin: 0 auto;
  height: 8em;
  line-height: 1;
}
.result-area {
}
</style>
