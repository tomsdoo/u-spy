export function ensureCustomIterator(tagName?: string) {
  customElements.define(tagName ?? "custom-iterator", class extends HTMLElement {
    static get observedAttributes() {
      return ["items"];
    }
    shadowRoot: ShadowRoot;
    isTemplateReady: boolean;
    contentTags: Node[];
    constructor() {
      super();
      this.shadowRoot = this.attachShadow({ mode: "closed" });
      this.shadowRoot.appendChild(document.createRange().createContextualFragment(`<slot></slot>`));
      this.isTemplateReady = false;
      this.contentTags = [];
    }
    get items() {
      try {
        const itemsStr = this.getAttribute("items");
        if (itemsStr == null) {
          return [];
        }
        return JSON.parse(itemsStr);
      } catch {
        return [];
      }
    }
    set items(value) {
      if (JSON.stringify(value) === JSON.stringify(this.items)) {
        return;
      }
      this.shadowRoot.host.setAttribute("items", JSON.stringify(value));
    }
    getReadyTemplate() {
      if (this.isTemplateReady) {
        return;
      }
      this.contentTags = Array.from(this.querySelectorAll("*"))
        .map(contentTag => contentTag.cloneNode(true));
      this.isTemplateReady = true;
    }
    connectedCallback() {
      this.getReadyTemplate();
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (name !== "items") {
        return;
      }
      this.items = (() => {
        try {
          return JSON.parse(newValue);
        } catch {
          return [];
        }
      })();
      this.getReadyTemplate();
      for(const child of Array.from(this.children)) {
        if (/template/i.test(child.tagName)) {
          continue;
        }
        child.remove();
      }
      for(const item of this.items) {
        for(const contentTag of this.contentTags) {
          const el = this.appendChild(contentTag.cloneNode(true)) as HTMLElement;
          const itemGetter = el.getAttribute(":item");
          const embeddingItem = itemGetter == null
            ? item
            : (() => {
              const [,...propLayers] = itemGetter.split(/[[\].]/);
              function getValue(item: any, propLayers: string[]) {
                if (propLayers == null) {
                  return item;
                }
                const [prop, ...restPropLayers] = propLayers;
                if (prop in item === false) {
                  return item;
                }
                return getValue(item[prop], restPropLayers);
              }
              const value = getValue(item, propLayers.filter(s => s !== ""));
              return value;
            })();
          el.setAttribute("item", JSON.stringify(embeddingItem));
        }
      }
    }
  });
}
