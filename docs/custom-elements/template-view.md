---
outline: deep
---

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


