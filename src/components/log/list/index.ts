import { template } from "./template";
import { ControlElement } from "@/components/control-element";

const TAG_NAME = "u-spy-log-list";

export class LogListElement extends HTMLElement {
  connectedCallback() {
    const id = `u-spy-${crypto.randomUUID().replace(/-/g, "")}`;
    const shadowRoot = this.attachShadow({ mode: "open" });
    const controlId = shadowRoot.host.attributes.getNamedItem("control-id")?.value ?? "";
    shadowRoot.appendChild(
      document.createRange().createContextualFragment(template(id, ControlElement.ensure(controlId).logStore))
    );
    shadowRoot.querySelector(`#${id}`)
  }
  static create() {
    return document.createElement(TAG_NAME);
  }
}

try {
  globalThis.customElements.define(TAG_NAME, LogListElement);
} catch {}
