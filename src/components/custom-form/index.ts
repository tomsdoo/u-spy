import { BaseElement } from "@/components/base";
import { EventType } from "@/constants/event-type";
import { template } from "./template";

const TAG_NAME = "u-spy-custom-form";

const LOADED_EVENT = "custom-form-loaded";

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: CustomFormElement;
  }

  interface HTMLElementEventMap {
    [LOADED_EVENT]: CustomEvent<{
      element: CustomFormElement;
    }>;
  }
}

export class CustomFormElement extends BaseElement {
  id: string;
  static TAG_NAME = TAG_NAME;
  static LOADED_EVENT = LOADED_EVENT;
  static get observedAttributes() {
    return [];
  }
  constructor() {
    super();
    this.template = (instance) => template(instance);
    this.id = `uscf-${crypto.randomUUID()}`;
  }
  get titleElement() {
    return this.querySelector(`#${this.id} h1`);
  }
  connectedCallback() {
    this.render();
  }
  onRendered() {
    this.addEventListener(EventType.CLICK, (e) => {
      e.stopPropagation();
    });
    this.dispatchEvent(
      new CustomEvent(LOADED_EVENT, {
        bubbles: false,
        detail: { element: this },
      }),
    );
  }
  changeTitle(title: string) {
    if (this.titleElement == null) {
      return;
    }
    this.titleElement.textContent = title;
  }
}

try {
  globalThis.customElements.define(TAG_NAME, CustomFormElement);
} catch {}
