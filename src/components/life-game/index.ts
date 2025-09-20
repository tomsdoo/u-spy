import { BaseElement } from "@/components/base";
import { EventType } from "@/constants/event-type";
import { resetHandlers } from "./on-rendered";
import { template } from "./template";

const TAG_NAME = "u-spy-life-game";

export class LifeGameElement extends BaseElement {
  id: string;
  boardWidth: string;
  boardHeight: string;
  cells: {
    x: number;
    y: number;
    alive: boolean;
  }[];
  static get observedAttributes() {
    return [":board-width", ":board-height"];
  }
  static TAG_NAME = TAG_NAME;
  constructor() {
    super();
    this.template = (instance) => template(instance);
    this.id = `uslg-${crypto.randomUUID()}`;
    this.boardWidth = "";
    this.boardHeight = "";
    this.cells = [];
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
    const { startGame } = resetHandlers(this);
    startGame();
  }
  static create() {
    return document.createElement(TAG_NAME);
  }
}

try {
  globalThis.customElements.define(TAG_NAME, LifeGameElement);
} catch {}
