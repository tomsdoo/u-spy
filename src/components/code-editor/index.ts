import { BaseElement } from "@/components/base";
import { ensureStore } from "@/components/store";
import { LowerChar } from "@/constants/char";
import { EventType } from "@/constants/event-type";
import { createStorageProxy } from "@/storage";
import { resetHandlers } from "./on-rendered";
import { template } from "./template";

const TAG_NAME = "u-spy-code-editor";
const STORE_ID = "u-spy-code-store";
const STORAGE_PREFIX = "_spy_code_";

export class CodeEditorElement extends BaseElement {
  id: string;
  _codeText: string;
  _store: ReturnType<typeof ensureStore>;
  _storage: ReturnType<typeof createStorageProxy>;
  keyEventHandler: ((e: KeyboardEvent) => void) | null;
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
  get storageData() {
    try {
      return JSON.parse(this._storage.data);
    } catch {
      return {};
    }
  }
  get executeButton() {
    return this.querySelector<HTMLButtonElement>(`#${this.id} .execute-button`);
  }
  get formatButton() {
    return this.querySelector<HTMLButtonElement>(`#${this.id} .format-button`);
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
  constructor() {
    super();
    this.template = (instance) => template(instance);
    this.id = `usce-${crypto.randomUUID()}`;
    this._store = ensureStore(STORE_ID);
    this._codeText = this.storedCode;
    this._storage = createStorageProxy(STORAGE_PREFIX);
    this.keyEventHandler = null;
  }
  connectedCallback() {
    this._codeText = this.storedCode;
    this.keyEventHandler = (e) => {
      switch (e.key) {
        case LowerChar.E:
          this.executeButton?.click();
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
  onCodeTextChange() {
    this.storedCode = this.codeText;
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
  globalThis.customElements.define(TAG_NAME, CodeEditorElement);
} catch {}
