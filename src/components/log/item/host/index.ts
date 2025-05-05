import { EventType } from "@/constants/event-type";
import { template } from "./template";

const TAG_NAME = "u-spy-log-item-host";

export class LogItemHostElement extends HTMLElement {
  static TAG_NAME = TAG_NAME;
  connectedCallback() {
    const id = `usid-${crypto.randomUUID()}`;
    const shadowRoot = this.attachShadow({ mode: "open" });
    const host = shadowRoot.host.attributes.getNamedItem("host")?.value ?? "";
    const url = shadowRoot.host.attributes.getNamedItem("url")?.value ?? "";
    shadowRoot.appendChild(
      document.createRange().createContextualFragment(template({ id, url, host })),
    );
    const el = shadowRoot.querySelector(`#${id}`);
    if (el == null) {
      return;
    }
    el.addEventListener(EventType.CLICK, () => {
      el.classList.toggle("detailed");
    });
  }
}

try {
  globalThis.customElements.define(TAG_NAME, LogItemHostElement);
} catch {}
