import { BaseElement } from"@/components/base";
import { UtilsElement } from "@/components/utils";
import { EventType } from "@/constants/event-type";
import { template } from "./template";

const TAG_NAME = "u-spy-code-editor";
const CODE_TAG_ID = "u-spy-code-edited";

function ensureCodeTag() {
  const existingCodeTag = document.querySelector<HTMLElement>(`#${CODE_TAG_ID}`);
  if (existingCodeTag != null) {
    return existingCodeTag;
  }
  const codeTag = document.createElement("pre");
  codeTag.id = CODE_TAG_ID;
  codeTag.style.display = "none";
  document.body.appendChild(codeTag);
  return codeTag;
}

export class CodeEditorElement extends BaseElement {
  id: string;
  _codeText: string;
  _codeTag: HTMLElement;
  static get observedAttributes() {
    return [];
  }
  static TAG_NAME = TAG_NAME;
  get codeText() {
    return this._codeText;
  }
  set codeText(value: string) {
    this._codeText = value;
    this.onCodeTextChange();
  }
  constructor() {
    super();
    this.template = (instance) => template(instance);
    this.id = `usce-${crypto.randomUUID()}`;
    this._codeTag = ensureCodeTag();
    this._codeText = this._codeTag.innerHTML;
  }
  get codeTag() {
    return this._codeTag ?? ensureCodeTag();
  }
  connectedCallback() {
    this._codeText = this.codeTag.innerHTML;
    this.render();
  }
  onRendered() {
    this.addEventListener(EventType.CLICK, (e) => {
      e.stopPropagation();
    });
    const textarea = this.querySelector<HTMLTextAreaElement>(`#${this.id} > form > textarea`);
    if (textarea == null) {
      return;
    }
    textarea.value = this.codeText;
    textarea.addEventListener("keydown", (e) => {
      e.stopPropagation();
      setTimeout(() => {
        this.codeText = textarea.value;
      }, 1);
      if (e.key === "Escape") {
        textarea.blur();
      }
    });
    setTimeout(() => {
      textarea.focus();
    }, 1);
    const formatButton = this.querySelector<HTMLButtonElement>(`#${this.id} .format-button`);
    if (formatButton == null) {
      return;
    }
    formatButton.addEventListener(EventType.CLICK, async () => {
      this.codeText = await UtilsElement.ensure().prettierFormat(
        this.codeText,
        "typescript",
      );
      textarea.value = this.codeText;
    });
    const executeButton = this.querySelector<HTMLButtonElement>(`#${this.id} .execute-button`);
    if (executeButton == null) {
      return;
    }
    executeButton.addEventListener(EventType.CLICK, async () => {
      const scriptTag = document.createElement("script");
      const eventName = "usc-exec";
      const functionName = `usc${crypto.randomUUID().replace(/-/g, "")}`;
      const codeText = this.codeText;
      scriptTag.innerHTML = [
        `async function ${functionName}() { window.removeEventListener("${eventName}", ${functionName}); ${codeText}}`,
        `window.addEventListener("${eventName}", ${functionName});`,
        `document.currentScript.remove();`,
      ].join("\n");
      document.body.appendChild(scriptTag);
      window.dispatchEvent(new CustomEvent(eventName));
    });
  }
  onCodeTextChange() {
    this._codeTag.innerHTML = this.codeText;
  }
}

try {
  globalThis.customElements.define(TAG_NAME, CodeEditorElement);
} catch {}
