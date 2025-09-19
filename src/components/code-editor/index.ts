import { BaseElement } from "@/components/base";
import { ensureStore } from "@/components/store";
import { EventType } from "@/constants/event-type";
import { createStorageProxy } from "@/storage";
import { template } from "./template";
import { resetHandlers } from "./on-rendered";

const TAG_NAME = "u-spy-code-editor";
const STORE_ID = "u-spy-code-store";
const STORAGE_PREFIX = "_spy_code_";

export class CodeEditorElement extends BaseElement {
  id: string;
  _codeText: string;
  _store: ReturnType<typeof ensureStore>;
  _storage: ReturnType<typeof createStorageProxy>;
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
  constructor() {
    super();
    this.template = (instance) => template(instance);
    this.id = `usce-${crypto.randomUUID()}`;
    this._store = ensureStore(STORE_ID);
    this._codeText = this.storedCode;
    this._storage = createStorageProxy(STORAGE_PREFIX);
  }
  connectedCallback() {
    this._codeText = this.storedCode;
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
}

try {
  globalThis.customElements.define(TAG_NAME, CodeEditorElement);
} catch {}
