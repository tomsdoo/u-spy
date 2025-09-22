import { BaseElement } from "@/components/base";
import { LowerChar } from "@/constants/char";
import { EventType } from "@/constants/event-type";
import { createStorageProxy } from "@/storage";
import { createTrustedHtml } from "@/trusted-policy";
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
  keyEventHandler: ((e: KeyboardEvent) => void) | null;
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
    this.keyEventHandler = null;
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
  get copyButton() {
    return this.querySelector<HTMLButtonElement>(`#${this.id} .copy-button`);
  }
  get formatButton() {
    return this.querySelector<HTMLButtonElement>(`#${this.id} .format-button`);
  }
  get downloadButton() {
    return this.querySelector<HTMLButtonElement>(
      `#${this.id} .download-button`,
    );
  }
  get loadButton() {
    return this.querySelector<HTMLButtonElement>(`#${this.id} .load-button`);
  }
  get saveButton() {
    return this.querySelector<HTMLButtonElement>(`#${this.id} .save-button`);
  }
  get saveForm() {
    return this.querySelector<HTMLFormElement>(`#${this.id} .save-form`);
  }
  get selectForm() {
    return this.querySelector<HTMLFormElement>(`#${this.id} .select-form`);
  }
  get textarea() {
    return this.querySelector<HTMLTextAreaElement>(
      `#${this.id} > .editor-form > textarea`,
    );
  }
  connectedCallback() {
    this._styleText = this.styleTag.innerHTML;
    this.keyEventHandler = (e) => {
      switch (e.key) {
        case LowerChar.C:
          this.copyButton?.click();
          return;
        case LowerChar.D:
          this.downloadButton?.click();
          return;
        case LowerChar.F:
          this.formatButton?.click();
          return;
        case LowerChar.L:
          this.loadButton?.click();
          return;
        case LowerChar.S:
          this.saveButton?.click();
          return;
        default:
          return;
      }
    };
    window.addEventListener(EventType.KEYUP, this.keyEventHandler);
    this.render();
  }
  onRendered() {
    this.addEventListener(EventType.CLICK, (e) => {
      e.stopPropagation();
    });
    resetHandlers(this);
  }
  onStyleTextChange() {
    this.styleTag.innerHTML = createTrustedHtml(this.styleText);
  }
  disconnectedCallback() {
    if (this.keyEventHandler == null) {
      return;
    }
    window.removeEventListener(EventType.KEYUP, this.keyEventHandler);
    this.keyEventHandler = null;
  }
}

try {
  globalThis.customElements.define(TAG_NAME, StyleEditorElement);
} catch {}
