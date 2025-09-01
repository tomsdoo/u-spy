import { BaseElement } from "@/components/base";
import { EventType } from "@/constants/event-type";
import { template } from "./template";

const TAG_NAME = "u-spy-custom-form";

export class CustomFormElement extends BaseElement {
  id: string;
  static TAG_NAME = TAG_NAME;
  static get observedAttributes() {
    return [];
  }
  constructor() {
    super();
    this.template = (instance) => template(instance);
    this.id = `uscf-${crypto.randomUUID()}`;
  }
  connectedCallback() {
    this.render();
  }
  onRendered() {
    this.addEventListener(EventType.CLICK, (e) => {
      e.stopPropagation();
    });
    this.dispatchEvent(
      new CustomEvent("load", {
        bubbles: false,
        detail: { element: this },
      }),
    );
  }
}

try {
  globalThis.customElements.define(TAG_NAME, CustomFormElement);
} catch {}
