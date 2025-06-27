export function ensureCustomIterator(tagName?: string) {
  customElements.define(tagName ?? "custom-iterator", class extends HTMLElement {
    static get observedAttributes() {
      return ["items"];
    }
    shadowRoot: ShadowRoot;
    isTemplateReady: boolean;
    contentTag: Node | null;
    constructor() {
      super();
      this.shadowRoot = this.attachShadow({ mode: "closed" });
      this.shadowRoot.appendChild(document.createRange().createContextualFragment(`<slot></slot>`));
      this.isTemplateReady = false;
      this.contentTag = null;
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
      const contentTag = this.querySelector("*");
      if (contentTag == null) {
        return;
      }
      this.contentTag = contentTag.cloneNode(true);
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
        if (this.contentTag) {
          (this.appendChild(this.contentTag?.cloneNode(true)) as HTMLElement).setAttribute("item", JSON.stringify(item));
        }
      }
    }
  });
}
