import { BaseElement } from"@/components/base";
import { UtilsElement } from "@/components/utils";
import { ensureStore } from "@/components/store";
import { EventType } from "@/constants/event-type";
import { template } from "./template";

const TAG_NAME = "u-spy-code-editor";
const STORE_ID = "u-spy-code-store";

export class CodeEditorElement extends BaseElement {
  id: string;
  _codeText: string;
  _store: ReturnType<typeof ensureStore>;
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
  get storedCode() {
    return (this._store.code ?? "") as string;
  }
  set storedCode(value: string) {
    this._store.code = value;
  }
  constructor() {
    super();
    this.template = (instance) => template(instance);
    this.id = `usce-${crypto.randomUUID()}`;
    this._store = ensureStore(STORE_ID);
    this._codeText = this.storedCode;
  }
  connectedCallback() {
    this._codeText = this.storedCode;
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
    this.storedCode = this.codeText;
  }
}

try {
  globalThis.customElements.define(TAG_NAME, CodeEditorElement);
} catch {}
