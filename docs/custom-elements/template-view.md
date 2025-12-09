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
  <div class="user-info">
    hi, <span :text="login.name"></span>!
  </div>
  <form onsubmit="return false" @submit="filterFruits">
    <input :value="keyword" @input="consoleLog" placeholder="keyword.." />
  </form>
  <ul class="fruit-list">
    <li :for="filteredFruits" @click="addToCart">
      <div :text="name"></div>
      <div :text="price"></div>
    </li>
  </ul>
  <ul class="cart-item-list">
    <li :for="cart.items">
      <div :text="name"></div>
      <div :text="quantity"></div>
      <div :text="amount"></div>
    </li>
  </ul>
  <div :if="cart.isAmountVisible" class="cart-amount" :text="cart.amount"></div>
  <div :if-not="cart.isAmountVisible" class="cart-amount empty">cart is empty..</div>
</div>
${makeTag("style")}
:host {
  color: green;
}
ul {
  padding-inline: 0;
}
.wrapper {
  .title {
    font-size: 1.2rem;
    color: red;
    text-align: center;
  }
  .user-info {
    text-align: right;
  }
  form {
    display: grid;
    justify-content: end;
  }
  .fruit-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    > li {
      display: grid;
      grid-template-columns: 1fr auto;
      padding: 1em;
      border-radius: 0.5em;
      box-shadow: inset 0 0 1px;
      cursor: pointer;
      > div:nth-child(2) {
        font-size: 0.8em;
      }
      &:hover {
        box-shadow: inset 0 0 2px;
      }
    }
  }
  .cart-item-list {
    display: grid;
    > li {
      display: grid;
      grid-template-columns: 1fr 3em 5em;
      gap: 1rem;
      > div:nth-child(2) {
        text-align: right;
      }
      > div:nth-child(2)::before {
        content: "x";
      }
      > div:nth-child(3) {
        text-align: right;
      }
    }
  }
  .cart-amount {
    text-align: right;
    &:not(.empty)::before {
      content: "amount: ";
    }
  }
}
${makeTag("style", true)}
`;
const codeText = ref(defaultCodeText);

const _valueJsonText = ref(JSON.stringify({
  title: "sample fruit shop",
  login: {
    id: 1,
    name: "alice",
  },
  cart: {
    items: [],
  },
  allFruits: [
    {
      name: "apple",
      price: 100,
    },
    {
      name: "banana",
      price: 50,
    },
  ],
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
      (item) => {
        const amount = item.cart.items
          .reduce(
            (summaryAmount, { amount }) => summaryAmount + amount, 0
          );
        return {
          ...item,
          cart: {
            ...item.cart,
            amount,
            isAmountVisible: amount > 0,
          },
        };
      },
      (item) => {
        const nextItem = {
          ...item,
        };
        const regExps = (item.keyword ?? "").split(/\s+/)
          .filter(Boolean)
          .map(s => new RegExp(s, "i"));
        const filteredFruits = item.allFruits
          .filter(({ name }) =>
            regExps.length === 0
              ? true
              : regExps.every(regExp => regExp.test(name))
          );
        return {
          ...item,
          filteredFruits,
        };
      },
    ];
    document.querySelector(
      `#${templateId.value}`
    ).eventHandlers = {
      filterFruits (e, item, wholeItem, reflux) {
        reflux({
          ...wholeItem,
          keyword: e.target.querySelector("input")?.value ?? "",
        });
      },
      addToCart (_, item, wholeItem, reflux) {
        const itemName = item.name;
        const fruit = wholeItem.filteredFruits
          .find(({ name }) => name === itemName);
        if (fruit == null) {
          return;
        }

        const nextItem = {
          ...wholeItem,
        };
        const cartItem = (() => {
          const quantity = (
            wholeItem.cart.items.find(
              ({ name }) => name === itemName
            )?.quantity ?? 0
          ) + 1;
          return {
            name: fruit.name,
            quantity,
            amount: quantity * fruit.price,
          };
        })();
        nextItem.cart.items = [
          ...nextItem.cart.items
            .filter(({ name }) => name !== itemName),
          cartItem,
        ].toSorted(
          (a,b) => a.name === b.name ? 0 : a.name > b.name ? 1 : -1
        );
        reflux(nextItem);
      },
      consoleLog (e, item) {
        console.log(e.target, item);
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
  (item) => {
    const amount = item.cart.items
      .reduce(
        (summaryAmount, { amount }) => summaryAmount + amount, 0
      );
    return {
      ...item,
      cart: {
        ...item.cart,
        amount,
        isAmountVisible: amount > 0,
      },
    };
  },
  (item) => {
    const regExps = (item.keyword ?? "").split(/\s+/)
      .filter(Boolean)
      .map(s => new RegExp(s, "i"));
    const filteredFruits = item.allFruits
      .filter(({ name }) =>
        regExps.length === 0
          ? true
          : regExps.every(regExp => regExp.test(name))
      );
    return {
      ...item,
      filteredFruits,
    };
  },
];
document.querySelector("#my-template").eventHandlers = {
  filterFruits (e, item, wholeItem, reflux) {
    reflux({
      ...wholeItem,
      keyword: e.target.querySelector("input")?.value ?? "",
    });
  },
  addToCart (_, item, wholeItem, reflux) {
    const itemName = item.name;
    const fruit = wholeItem.fruits
      .find(({ name }) => name === itemName);
    if (fruit == null) {
      return;
    }

    const nextItem = {
      ...wholeItem,
    };
    const cartItem = (() => {
      const quantity = (
        wholeItem.cart.items.find(
          ({ name }) => name === itemName
        )?.quantity ?? 0
      ) + 1;
      return {
        name: fruit.name,
        quantity,
        amount: quantity * fruit.price,
      };
    })();
    nextItem.cart.items = [
      ...nextItem.cart.items
        .filter(({ name }) => name !== itemName),
      cartItem,
    ].toSorted(
      (a,b) => a.name === b.name ? 0 : a.name > b.name ? 1 : -1
    );
    reflux(nextItem);
  },
  consoleLog (e, item) {
    console.log(e.target, item);
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
