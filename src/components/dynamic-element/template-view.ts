import { deflate } from "@/utils/deflate";

export function ensureTemplateView(customTagName?: string) {
  const localTagName = customTagName ?? "template-view";
  if (customElements.get(localTagName)) {
    return;
  }

  customElements.define(
    localTagName,
    class extends HTMLElement {
      static get observedAttributes() {
        return ["item"];
      }
      isTemplateReady: boolean;
      isRefreshRequired: boolean;
      contentTags: Node[];
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.isTemplateReady = false;
        this.contentTags = [];
        this.isRefreshRequired = true;
      }
      get item() {
        try {
          const itemStr = this.getAttribute("item");
          if (itemStr == null) {
            return {};
          }
          return JSON.parse(itemStr);
        } catch {
          return {};
        }
      }
      set item(v) {
        if (JSON.stringify(v) === JSON.stringify(this.item)) {
          return;
        }
        this.isRefreshRequired = true;
        this.setAttribute("item", JSON.stringify(v));
      }
      getReadyTemplate() {
        if (this.isTemplateReady === false) {
          this.contentTags = Array.from(this.querySelectorAll("*"))
            .filter(({ parentElement }) => parentElement === this)
            .map((contentTag) => {
              const clonedTag = contentTag.cloneNode(true);
              contentTag.remove();
              return clonedTag;
            });
        }
        for(const childNode of Array.from(this.shadowRoot?.childNodes ?? [])) {
          childNode.remove();
        }
        for (const contentTag of this.contentTags) {
          this.shadowRoot?.appendChild(contentTag.cloneNode(true));
        }
        this.isTemplateReady = true;
      }
      render() {
        this.getReadyTemplate();
        if (this.isRefreshRequired !== true) {
          return;
        }
        const deflatedItem = deflate(this.item);
        (function embed(node: Node | null, item: ReturnType<typeof deflate>) {
          console.log("embed start", { node });
          if (node == null) {
            return;
          }

          if (node instanceof HTMLElement && node.hasAttribute(":text")) {
            const propName = node.getAttribute(":text");
            if (propName == null) {
              return;
            }
            if (propName === ".") {
              node.textContent = String(item);
              return;
            }
            if (propName in item === false) {
              node.textContent = "";
              return;
            }
            const embeddingValue = item[propName];
            node.textContent = String(embeddingValue);
            return;
          }

          for (const childNode of Array.from(node.childNodes)) {
            console.log("embed", {
              childNode,
              instanceofHTMLElement: childNode instanceof HTMLElement,
            });
            if (childNode instanceof HTMLElement === false) {
              continue;
            }
            console.log("it is HTMLElement", {
              childNode,
              instanceofHTMLElement: childNode instanceof HTMLElement,
              attr: childNode.attributes,
              textAttr: childNode.attributes.getNamedItem(":text"),
              hasText: childNode.hasAttribute(":text"),
            });
            if (childNode.hasAttribute(":for")) {
              const propName = childNode.getAttribute(":for");
              if (propName == null) {
                continue;
              }
              if (Array.isArray(item[propName]) === false) {
                childNode.remove();
                continue;
              }
              for (const childItem of item[propName]) {
                const addedNode = childNode.parentNode?.insertBefore(
                  childNode.cloneNode(true),
                  childNode,
                );
                const deflatedChildItem = deflate(childItem);
                embed(addedNode ?? null, deflatedChildItem);
              }
              childNode.remove();
              continue;
            }
            embed(childNode, item);
          }
        })(this.shadowRoot, deflatedItem);
        this.isRefreshRequired = false;
      }
      connectedCallback() {
        this.render();
      }
      attributeChangedCallback(
        name: string,
        _ondValue: string,
        newValue: string,
      ) {
        if (name !== "item") {
          return;
        }
        this.item = (() => {
          try {
            return JSON.parse(newValue);
          } catch {
            return {};
          }
        })();
        this.render();
      }
    },
  );
}
