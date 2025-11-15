import { createTrustedHtml } from "@/trusted-policy";
import { shadowHostStyle } from "./template";

export class BaseElement extends HTMLElement {
  template: string | ((instance: typeof this) => Promise<string>) = "";
  static get observedAttributes() {
    return [] as string[];
  }
  shadowHostStyle: string = shadowHostStyle;
  get usingShadow() {
    return false;
  }
  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (/:/.test(name) === false) {
      return;
    }
    const propName = name
      .replace(/^[s|o]?:/i, "")
      .replace(/-([a-z])/g, (_$0, $1) => $1.toUpperCase());
    const isPropValid = ((
      instance: typeof this,
      propName: string,
    ): instance is typeof this & { [propName: string]: string } => {
      return propName in instance;
    })(this, propName);
    if (isPropValid === false) {
      return;
    }
    // @ts-expect-error writing instance property
    this[propName] = (() => {
      const isObject = name.startsWith("o:");
      try {
        return isObject ? JSON.parse(newValue) : newValue;
      } catch {
        return newValue;
      }
    })();
    this.render();
  }
  async render() {
    const contentHtml =
      typeof this.template === "string"
        ? this.template
        : await this.template(this);
    const root = this.usingShadow
      ? (this.shadowRoot ?? this.attachShadow({ mode: "open" }))
      : this;
    root.innerHTML = createTrustedHtml("");
    root.appendChild(
      document
        .createRange()
        .createContextualFragment(createTrustedHtml(contentHtml)),
    );
    this.onRendered();
  }
  connectedCallback() {}
  disconnectedCallback() {}
  onRendered() {}
}
