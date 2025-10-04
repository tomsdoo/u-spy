import { BaseElement } from "@/components/base";
import { useEscapeKeyRemoval } from "@/composables/escape-key-removal";
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
    useEscapeKeyRemoval(this);
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
