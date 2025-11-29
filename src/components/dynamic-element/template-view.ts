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
        return ["value"];
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
      get value() {
        try {
          const itemStr = this.getAttribute("value");
          if (itemStr == null) {
            return {};
          }
          return JSON.parse(itemStr);
        } catch {
          return {};
        }
      }
      set value(v) {
        if (JSON.stringify(v) === JSON.stringify(this.value)) {
          return;
        }
        this.isRefreshRequired = true;
        this.setAttribute("value", JSON.stringify(v));
      }
      getReadyTemplate() {
        if (this.isTemplateReady) {
          return;
        }
        this.contentTags = Array.from(this.querySelectorAll("*"))
          .filter(({ parentElement }) => parentElement === this)
          .map((contentTag) => {
            const clonedTag = contentTag.cloneNode(true);
            contentTag.remove();
            return clonedTag;
          });
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
        const deflatedValue = deflate(this.value);
        for (const el of Array.from(
          this.shadowRoot?.querySelectorAll(`[\\:text]`) ?? [],
        )) {
          const propName = el.getAttribute(":text");
          if (propName == null) {
            continue;
          }
          if (propName in deflatedValue === false) {
            el.textContent = "";
            continue;
          }
          const embeddingValue = deflatedValue[propName];
          el.textContent = String(embeddingValue);
        }
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
        if (name !== "value") {
          return;
        }
        this.value = (() => {
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
