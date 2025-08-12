import { BaseElement } from "@/components/base";
import { template } from "./template";
import { EventType } from "@/constants/event-type";
import { UtilsElement } from "@/components/utils";

const TAG_NAME = "u-spy-style-editor";
const STYLE_TAG_ID = "u-spy-style-edited";

function ensureStyleTag() {
  const existingStyleTag = document.querySelector<HTMLStyleElement>(`#${STYLE_TAG_ID}`);
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
  }
  get styleTag() {
    return this._styleTag ?? ensureStyleTag();
  }
  connectedCallback() {
    this._styleText = this.styleTag.innerHTML;
    this.render();
  }
  onRendered() {
    const that = this;
    this.addEventListener(EventType.CLICK, (e) => {
      e.stopPropagation();
    });
    const textarea = this.querySelector<HTMLTextAreaElement>(`#${this.id} > form > textarea`);
    if (textarea == null) {
      return;
    }
    textarea.value = this.styleText;
    textarea.addEventListener("keydown", (e) => {
      e.stopPropagation();
      setTimeout(() => {
        that.styleText = textarea.value;
      }, 1);
      if (e.key === "Escape") {
        textarea.blur();
      }
    });
    setTimeout(() => {
      textarea.focus();
    }, 1);
    const downloadButton = this.querySelector<HTMLButtonElement>(`#${this.id} .download-button`);
    if (downloadButton == null) {
      return;
    }
    downloadButton.addEventListener(EventType.CLICK, async () => {
      UtilsElement.ensure().download({
        data: this.styleText,
        filename: "style.css",
      });
    });
    const copyButton = this.querySelector<HTMLButtonElement>(`#${this.id} .copy-button`);
    if (copyButton == null) {
      return;
    }
    copyButton.addEventListener(EventType.CLICK, async () => {
      await navigator.clipboard.writeText(this.styleText);
    });
    const formatButton = this.querySelector<HTMLButtonElement>(`#${this.id} .format-button`);
    if (formatButton == null) {
      return;
    }
    formatButton.addEventListener(EventType.CLICK, async () => {
      this.styleText = await UtilsElement.ensure().prettierFormat(this.styleText, "css");
      textarea.value = this.styleText;
    });
  }
  onStyleTextChange() {
    this.styleTag.innerHTML = this.styleText;
  }
}

try {
  globalThis.customElements.define(TAG_NAME, StyleEditorElement);
} catch {}
