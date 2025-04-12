import { template } from "./template";

const TAG_NAME = "easy-spy-entry-point";

export class EntryPointElement extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(
      document.createRange().createContextualFragment(template)
    );
  }
}

export function appendEntryPoint() {
  const entryPointTag = document.createElement(TAG_NAME);
  entryPointTag.style.display = "none";
  document.body.appendChild(entryPointTag);
}

try {
  globalThis.customElements.define(TAG_NAME, EntryPointElement);
} catch {}
