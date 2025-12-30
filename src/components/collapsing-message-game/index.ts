import { BaseElement } from "@/components/base";
import { useEscapeKeyRemoval } from "@/composables/escape-key-removal";
import { resetHandlers } from "./on-rendered";
import { template } from "./template";

const TAG_NAME = "u-spy-collapsing-message-game";

export class CollapsingMessageGameElement extends BaseElement {
  id: string;
  static get observedAttributes() {
    return [];
  }
  static TAG_NAME = TAG_NAME;
  constructor() {
    super();
    this.template = (instance) => template(instance);
    this.id = `uscmg-${crypto.randomUUID()}`;
  }
  get usingShadow() {
    return true;
  }
  connectedCallback() {
    useEscapeKeyRemoval(this);
    this.render();
  }
  onRendered() {
    const { startGame } = resetHandlers(this);
    startGame();
  }
  static create() {
    return document.createElement(TAG_NAME);
  }
}

try {
  globalThis.customElements.define(TAG_NAME, CollapsingMessageGameElement);
} catch {}
