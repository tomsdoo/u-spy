import { BaseElement } from "@/components/base";
import { EventType } from "@/constants/event-type";
import { template } from "./template";

const TAG_NAME = "u-spy-iframe-modal";

export class IframeModalElement extends BaseElement {
  id: string;
  src: string;
  static get observedAttributes() {
    return [":src"];
  }
  static TAG_NAME = TAG_NAME;
  constructor() {
    super();
    this.template = (instance) => template(instance);
    this.id = `usr-${crypto.randomUUID()}`;
    this.src = "";
  }
  connectedCallback() {
    const instance = this;
    function removalKeyHandler(e: KeyboardEvent) {
      if (e.key !== "Escape") {
        return;
      }

      try {
        instance.remove();
        window.removeEventListener(EventType.KEYDOWN, removalKeyHandler);
      } catch {}
    }
    window.addEventListener(EventType.KEYDOWN, removalKeyHandler);
    this.render();
  }
  onRendered() {
    this.querySelector(`#${this.id}`)?.addEventListener(EventType.CLICK, () => {
      this.remove();
    });
  }
  static create() {
    return document.createElement(TAG_NAME);
  }
}

try {
  globalThis.customElements.define(TAG_NAME, IframeModalElement);
} catch {}
