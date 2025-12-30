import { BaseElement } from "@/components/base";
import { useEscapeKeyRemoval } from "@/composables/escape-key-removal";
import { resetHandlers } from "./on-rendered";
import { template } from "./template";

const TAG_NAME = "u-spy-collapsing-message-game";

export class CollapsingMessageGameElement extends BaseElement {
  id: string;
  message: string = "";
  fontSize: string = "48px";
  fontFamily: string = "sans-serif";
  speed: "normal" | "fast" | "slow" = "normal";
  static get observedAttributes() {
    return [":message", ":font-size", ":font-family", ":speed"];
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
    return document.createElement(TAG_NAME) as CollapsingMessageGameElement;
  }
  static ensure() {
    return (
      document.querySelector<CollapsingMessageGameElement>(
        CollapsingMessageGameElement.TAG_NAME,
      ) ?? CollapsingMessageGameElement.create()
    );
  }
  static show(
    message: string,
    options?: {
      fontSize?: string;
      fontFamily?: string;
      speed?: "normal" | "fast" | "slow";
    },
  ) {
    const element = CollapsingMessageGameElement.ensure();
    if (options?.fontSize != null) {
      element.fontSize = options.fontSize;
    }
    if (options?.fontFamily != null) {
      element.fontFamily = options.fontFamily;
    }
    if (options?.speed != null) {
      element.speed = options.speed;
    }
    element.message = message;
    document.body.appendChild(element);
  }
}

export function displayCollapsingMessage(
  message: string,
  options?: {
    fontSize?: string;
    fontFamily?: string;
    speed?: "normal" | "fast" | "slow";
  },
) {
  CollapsingMessageGameElement.show(message, options);
}

try {
  globalThis.customElements.define(TAG_NAME, CollapsingMessageGameElement);
} catch {}
