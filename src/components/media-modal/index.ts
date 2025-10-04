import { BaseElement } from "@/components/base";
import { useEscapeKeyRemoval } from "@/composables/escape-key-removal";
import { EventType } from "@/constants/event-type";
import { sleep } from "@/utils";
import { resetHandlers } from "./on-rendered";
import { template } from "./template";

const TAG_NAME = "u-spy-media-modal";

export class MediaModalElement extends BaseElement {
  id: string;
  images: string;
  _isCycle: boolean;
  _isCycleStarted: boolean;
  static get observedAttributes() {
    return [":images"];
  }
  static TAG_NAME = TAG_NAME;
  constructor() {
    super();
    this.template = (instance) => template(instance);
    this.id = `usmm-${crypto.randomUUID()}`;
    this.images = "";
    this._isCycle = false;
    this._isCycleStarted = false;
  }
  get imageSrcs() {
    try {
      return JSON.parse(this.images) as string[];
    } catch {
      return [] as string[];
    }
  }
  get isCycle() {
    return this._isCycle;
  }
  get isCycleStarted() {
    return this._isCycleStarted;
  }
  connectedCallback() {
    useEscapeKeyRemoval(this);
    this.addEventListener(EventType.CLICK, () => {
      this.remove();
    });
    this.render();
  }
  async onRendered() {
    if (this.isCycleStarted) {
      return;
    }
    this._isCycleStarted = true;

    const { startCycle } = resetHandlers(this);
    await sleep(1);
    this._isCycle = true;
    startCycle();
  }
  disconnectedCallback() {
    this._isCycle = false;
  }
  static create() {
    return document.createElement(TAG_NAME);
  }
}

try {
  globalThis.customElements.define(TAG_NAME, MediaModalElement);
} catch {}
