import { template } from "./template";

const TAG_NAME = "u-spy-popup";

export class PopupElement extends HTMLElement {
  static TAG_NAME = TAG_NAME;
  id: string = "";
  shadowRoot: ShadowRoot | null = null;
  messageMap: Map<string, string> = new Map();
  connectedCallback() {
    const id = `usid-${crypto.randomUUID()}`;
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(
      document.createRange().createContextualFragment(template(id)),
    );
    this.id = id;
    this.shadowRoot = shadowRoot;
  }
  get canRemoveRoot() {
    return this.messageMap.size === 0;
  }
  async addMessage(message: string) {
    if (this.shadowRoot == null) {
      return;
    }
    const messageId = crypto.randomUUID();
    this.messageMap.set(messageId, message);
    // biome-ignore lint/style/noNonNullAssertion: certainly exists
    const ul = this.shadowRoot.querySelector(`#${this.id}`)!;
    const li = ul.appendChild(document.createElement("li"));
    li.textContent = message;
    await new Promise((resolve) => setTimeout(resolve, 1));
    li.classList.add("visible");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    li.classList.remove("visible");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    li.remove();
    this.messageMap.delete(messageId);
  }
  static ensure() {
    return (
      document.querySelector<PopupElement>(PopupElement.TAG_NAME) ??
      document.body.appendChild<PopupElement>(
        document.createElement(PopupElement.TAG_NAME) as PopupElement,
      )
    );
  }
  static async show(message: string) {
    const popup = PopupElement.ensure();
    await popup.addMessage(message);
    if (popup.canRemoveRoot === false) {
      return;
    }
    popup.remove();
  }
}

export function showEphemeralMessage(message: string) {
  PopupElement.show(message);
}

try {
  globalThis.customElements.define(TAG_NAME, PopupElement);
} catch {}
