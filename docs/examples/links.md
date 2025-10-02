---
outline: deep
---

# links

It's an example for link list dialog.

``` js
const documentItems = [
  {
    type: "iframe",
    name: "u-spy reference",
    href: "https://tomsdoo.github.io/u-spy/",
  },
  {
    type: "tab",
    name: "google",
    href: "https://www.google.com",
  },
];

_spy.customElement.ensure("document-link", {
  templateHtml: `
    <button
      type="button"
      :value="name"
      :props="href,type"
      @click="openLink"
    ></button>
    <style>
    button {
      display: block;
      padding: 16px;
      border-radius: 8px;
      box-shadow: inset 0 0 1px;
      border: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      color: inherit;
      cursor: pointer;
      &:hover {
        box-shadow: inset 0 0 2px;
      }
    }
    </style>
  `,
  eventHandlers: {
    openLink(e, item) {
      _spy.eventBus.emit("open-link");
      if (item.type === "iframe") {
        _spy.iframe.display(item.href);
      } else {
        window.open(item.href);
      }
    },
  },
});

_spy.customElement.ensureIterator();

_spy.stroke.register("links", () => {
  const {
    close,
  } = _spy.dialog.display(dialogElement => {
    const id = `a${crypto.randomUUID()}`;
    dialogElement.appendChild(
      document.createRange().createContextualFragment(
        `<custom-iterator id="${id}">
          <document-link />
        </custon-iterator>
        <style>
        #${id} {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 16px;
        }
        </style>`
      ),
    );
    dialogElement.querySelector(`#${id}`).items = documentItems;
  }, { title: "links" });
  _spy.eventBus.once("open-link", () => {
    close();
  });
});
```
