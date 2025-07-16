import { template } from "./template";

const TAG_NAME = "u-spy-popup";

export class PopupElement extends HTMLElement {
  static TAG_NAME = TAG_NAME;
  id: string = "";
  shadowRoot: ShadowRoot | null = null;
  connectedCallback() {
    const id = `usid-${crypto.randomUUID()}`;
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(
      document.createRange().createContextualFragment(template(id))
    );
    this.id = id;
    this.shadowRoot = shadowRoot;
  }
  setMessage(message: string) {
    if (this.shadowRoot == null) {
      return;
    }
    this.shadowRoot.querySelector(`#${this.id}`)!.textContent = message;
  }
  static async show(message: string) {
    const popup = document.body.appendChild(document.createElement(PopupElement.TAG_NAME));
    if (popup instanceof PopupElement === false) {
      return;
    }
    popup.setMessage(message);
    const el = popup.shadowRoot?.querySelector(`#${popup.id}`);
    await new Promise(resolve => setTimeout(resolve, 1));
    el?.classList.add("visible");
    await new Promise(resolve => setTimeout(resolve, 2000));
    el?.classList.remove("visible");
    await new Promise(resolve => setTimeout(resolve, 1000));
    popup.remove();
  }
}

export function showEphemeralMessage(message: string) {
  PopupElement.show(message);
}

try {
  globalThis.customElements.define(TAG_NAME, PopupElement);
} catch {}
