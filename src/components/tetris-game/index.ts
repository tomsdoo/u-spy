import { BaseElement } from "@/components/base";
import { useEscapeKeyRemoval } from "@/composables/escape-key-removal";
import { resetHandlers } from "./on-rendered";
import { template } from "./template";

const TAG_NAME = "u-spy-tetris-game";

export class TetrisGameElement extends BaseElement {
  id: string;
  boardWidth: string = "";
  boardHeight: string = "";
  static get observedAttributes() {
    return [":board-width", ":board-height"];
  }
  static TAG_NAME = TAG_NAME;
  constructor() {
    super();
    this.template = (instance) => template(instance);
    this.id = `ustg-${crypto.randomUUID()}`;
  }
  get usingShadow() {
    return true;
  }
  get boardWidthValue() {
    if (/\d+/.test(this.boardWidth) === false) {
      return 0;
    }
    return Number(this.boardWidth);
  }
  get boardHeightValue() {
    if (/\d+/.test(this.boardHeight) === false) {
      return 0;
    }
    return Number(this.boardHeight);
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
  globalThis.customElements.define(TAG_NAME, TetrisGameElement);
} catch {}
