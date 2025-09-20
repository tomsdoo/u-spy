import { createTrustedHtml } from "@/trusted-policy";
import { template } from "./template";

const TAG_NAME = "u-spy-entry-point";

export class EntryPointElement extends HTMLElement {
  static TAG_NAME = TAG_NAME;
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(
      document
        .createRange()
        .createContextualFragment(createTrustedHtml(template)),
    );
  }
  static create() {
    const entryPointTag = document.createElement(EntryPointElement.TAG_NAME);
    entryPointTag.style.display = "none";
    document.body.appendChild(entryPointTag);
    return entryPointTag as EntryPointElement;
  }
  static ensure() {
    const existing = document.querySelector<EntryPointElement>(
      EntryPointElement.TAG_NAME,
    );
    if (existing != null) {
      return existing;
    }
    return EntryPointElement.create();
  }
}

try {
  globalThis.customElements.define(TAG_NAME, EntryPointElement);
} catch {}
