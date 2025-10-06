import { BaseElement } from "@/components/base";
import { useEscapeKeyRemoval } from "@/composables/escape-key-removal";
import { EventType } from "@/constants/event-type";
import { sleep } from "@/utils";
import { template } from "./template";

const TAG_NAME = "u-spy-media-modal";

export class MediaModalElement extends BaseElement {
  id: string;
  images: string;
  _isCycleStarted: boolean;
  cycleInterval: string;
  state: "running" | "paused";
  isDisconnected: boolean = false;
  static get observedAttributes() {
    return [":images", ":cycle-interval", ":state"];
  }
  static TAG_NAME = TAG_NAME;
  constructor() {
    super();
    this.template = (instance) => template(instance);
    this.id = `usmm-${crypto.randomUUID()}`;
    this.images = "";
    this._isCycleStarted = false;
    this.cycleInterval = "";
    this.state = "running";
  }
  get imageSrcs() {
    try {
      return JSON.parse(this.images) as string[];
    } catch {
      return [] as string[];
    }
  }
  get cycleIntervalMs() {
    if (this.cycleInterval === "") {
      return 10 * 1000;
    }
    return Number(this.cycleInterval);
  }
  get imageElements() {
    return Array.from(
      this.querySelectorAll<HTMLImageElement>(
        `#${this.id} .image-container img`,
      ),
    );
  }
  get activeImageIndex() {
    return this.imageElements.findIndex((img) =>
      img.classList.contains("active"),
    );
  }
  get nextImageIndex() {
    const nextIndex = this.activeImageIndex + 1;
    return nextIndex >= this.imageSrcs.length ? 0 : nextIndex;
  }
  get isCycle() {
    return this.state === "running";
  }
  get isCycleStarted() {
    return this._isCycleStarted;
  }
  async cycleImage() {
    const nextIndex = this.nextImageIndex;
    for (const imageElement of this.imageElements.filter(
      (_, index) => index !== nextIndex,
    )) {
      imageElement.classList.remove("active");
      imageElement.classList.add("to-leave");
      void sleep(500).then(() => {
        imageElement.classList.add("hidden");
        imageElement.classList.remove("to-leave");
      });
    }
    const imageElement = this.imageElements[nextIndex];
    imageElement.classList.add("from-enter");
    imageElement.classList.remove("hidden");
    await sleep(500);
    imageElement.classList.remove("from-enter");
    imageElement.classList.add("active");
  }
  async startCycle() {
    while (true) {
      if (this.isDisconnected) {
        break;
      }
      if (this.isCycle && this.imageSrcs.length > 1) {
        await this.cycleImage();
      }
      await sleep(this.cycleIntervalMs);
    }
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

    await sleep(1);
    this.startCycle();
  }
  disconnectedCallback() {
    this.isDisconnected = true;
  }
  static create() {
    return document.createElement(TAG_NAME);
  }
}

try {
  globalThis.customElements.define(TAG_NAME, MediaModalElement);
} catch {}
