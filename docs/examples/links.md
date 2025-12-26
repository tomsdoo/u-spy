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

_spy.customElement.ensureTemplateView();

_spy.stroke.register("links", () => {
  const { close } = _spy.dialog.display(
    (dialogElement) => {
      dialogElement.appendChild(
        document.createRange().createContextualFragment(`
          <template-view>
            <ul class="link-list">
              <li :for="documentItems">
                <button
                  type="button"
                  :text="name"
                  @click="openLink"
                ></button>
              </li>
            </ul>
            <style>
            ul {
              list-style: none;
              margin: 0;
              padding: 0;
            }
            .link-list {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
              gap: 16px;
              li {
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
            }
          }
          </style>
        </template-view>
      `));
      const tvElement = dialogElement.querySelector("template-view");
      tvElement.item = {
        documentItems,
      };
      tvElement.eventHandlers = {
        openLink(e, item) {
          if (item.type === "iframe") {
            _spy.iframe.display(item.href);
          } else {
            window.open(item.href);
          }
          close();
        },
      };
    },
    { title: "links" },
  );
});
```
