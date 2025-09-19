import { BaseElement } from "@/components/base";
import { EventType } from "@/constants/event-type";
import { createStorageProxy } from "@/storage";
import { resetHandlers } from "./on-rendered";
import { template } from "./template";

const TAG_NAME = "u-spy-style-editor";
const STYLE_TAG_ID = "u-spy-style-edited";
const STORAGE_PREFIX = "_spy_style_";

function ensureStyleTag() {
  const existingStyleTag = document.querySelector<HTMLStyleElement>(
    `#${STYLE_TAG_ID}`,
  );
  if (existingStyleTag != null) {
    return existingStyleTag;
  }
  const styleTag = document.createElement("style");
  styleTag.id = STYLE_TAG_ID;
  document.head.appendChild(styleTag);
  return styleTag;
}

export class StyleEditorElement extends BaseElement {
  id: string;
  _styleText: string;
  _styleTag: HTMLStyleElement;
  _storage: ReturnType<typeof createStorageProxy>;
  static get observedAttributes() {
    return [];
  }
  static TAG_NAME = TAG_NAME;
  get styleText() {
    return this._styleText;
  }
  set styleText(value: string) {
    this._styleText = value;
    this.onStyleTextChange();
  }
  constructor() {
    super();
    this.template = (instance) => template(instance);
    this.id = `usse-${crypto.randomUUID()}`;
    this._styleTag = ensureStyleTag();
    this._styleText = this.styleTag.innerHTML;
    this._storage = createStorageProxy(STORAGE_PREFIX);
  }
  get styleTag() {
    return this._styleTag ?? ensureStyleTag();
  }
  get storageData() {
    try {
      return JSON.parse(this._storage.data);
    } catch {
      return {};
    }
  }
  connectedCallback() {
    this._styleText = this.styleTag.innerHTML;
    this.render();
  }
  onRendered() {
    this.addEventListener(EventType.CLICK, (e) => {
      e.stopPropagation();
    });
    resetHandlers(this);
  }
  onStyleTextChange() {
    this.styleTag.innerHTML = this.styleText;
  }
}

try {
  globalThis.customElements.define(TAG_NAME, StyleEditorElement);
} catch {}
