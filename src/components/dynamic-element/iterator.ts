export function ensureCustomIterator(tagName?: string) {
  customElements.define(tagName ?? "custom-iterator", class extends HTMLElement {
    static get observedAttributes() {
      return ["items"];
    }
    shadowRoot: ShadowRoot;
    templateId: string;
    constructor() {
      super();
      this.shadowRoot = this.attachShadow({ mode: "closed" });
      this.shadowRoot.appendChild(document.createRange().createContextualFragment(`<slot></slot>`));
      this.templateId = `template-${crypto.randomUUID()}`;
    }
    get items() {
      try {
        const itemsStr = this.shadowRoot.host.getAttribute("items");
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
    connectedCallback() {
      console.log("asdf", this.querySelectorAll("*"));
      const templateTag = document.createElement("template");
      templateTag.id = this.templateId;
      const contentTag = this.querySelector("*");
      if (contentTag == null) {
        return;
      }
      templateTag.appendChild(contentTag);
      this.appendChild(templateTag);
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
      console.log(this.slot);
      console.log(this.shadowRoot);
      console.log(this.shadowRoot.slotAssignment);
      console.log(this.shadowRoot.querySelector("slot"));
      console.log(this.shadowRoot.querySelector("slot")?.querySelectorAll("*"));
      console.log(this.shadowRoot.host.querySelectorAll("*"));
    }
  });
}
