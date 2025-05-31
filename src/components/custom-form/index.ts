import { BaseElement } from "@/components/base";
import { template } from "./template";
import { EventType } from "@/constants/event-type";

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
    const that = this;
    this.addEventListener(EventType.CLICK, (e) => {
      e.stopPropagation();
    });
    this.dispatchEvent(
      new CustomEvent(
        'load',
        {
          bubbles: false,
          detail: { element: that },
        }
      )
    );
  }
}

try {
  globalThis.customElements.define(TAG_NAME, CustomFormElement);
} catch {}
