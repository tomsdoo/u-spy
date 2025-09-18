import { BaseElement } from "@/components/base";
import { InputFormElement } from "@/components/input-form";
import { SelectFormElement } from "@/components/select-form";
import { ensureStore } from "@/components/store";
import { UtilsElement } from "@/components/utils";
import { EventType } from "@/constants/event-type";
import { createStorageProxy } from "@/storage";
import { template } from "./template";

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
    const that = this;
    this.addEventListener(EventType.CLICK, (e) => {
      e.stopPropagation();
    });
    const textarea = this.querySelector<HTMLTextAreaElement>(
      `#${this.id} > form > textarea`,
    );
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
    const formatButton = this.querySelector<HTMLButtonElement>(
      `#${this.id} .format-button`,
    );
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
    const saveButton = this.querySelector<HTMLButtonElement>(
      `#${this.id} .save-button`,
    );
    if (saveButton == null) {
      return;
    }
    const saveForm = this.querySelector(`#${this.id} .save-form`);
    if (saveForm == null) {
      return;
    }
    const loadButton = this.querySelector<HTMLButtonElement>(
      `#${this.id} .load-button`,
    );
    if (loadButton == null) {
      return;
    }
    const selectForm = this.querySelector(`#${this.id} .select-form`);
    if (selectForm == null) {
      return;
    }
    saveButton.addEventListener(EventType.CLICK, () => {
      function saveHandler(e: { detail: { value: string } }) {
        const nextData = {
          ...that.storageData,
          // biome-ignore lint/style/noNonNullAssertion: textarea exists
          [e.detail.value]: textarea!.value,
        };
        that._storage.data = JSON.stringify(nextData);
        saveForm.removeEventListener(
          InputFormElement.FINISH_INPUT_EVENT,
          saveHandler,
        );
        saveForm.removeEventListener(
          InputFormElement.CANCEL_EVENT,
          cancelHandler,
        );
        saveForm?.classList.add("hidden");
      }
      function cancelHandler() {
        saveForm.removeEventListener(
          InputFormElement.FINISH_INPUT_EVENT,
          saveHandler,
        );
        saveForm.removeEventListener(
          InputFormElement.CANCEL_EVENT,
          cancelHandler,
        );
        saveForm?.classList.add("hidden");
      }
      saveForm.addEventListener(
        InputFormElement.FINISH_INPUT_EVENT,
        saveHandler,
      );
      saveForm.addEventListener(InputFormElement.CANCEL_EVENT, cancelHandler);
      saveForm.classList.remove("hidden");
    });
    loadButton.addEventListener(EventType.CLICK, () => {
      const options = Array.from(Object.keys(that.storageData));
      function chooseHandler(e: { detail: { value: string } }) {
        textarea.value = that.storageData[e.detail.value];
        that.codeText = that.storageData[e.detail.value];
        selectForm.classList.add("hidden");
        selectForm.removeEventListener(
          SelectFormElement.CHOOSE_EVENT,
          chooseHandler,
        );
        selectForm.removeEventListener(
          SelectFormElement.REMOVE_EVENT,
          removeHandler,
        );
        selectForm.removeEventListener(
          SelectFormElement.CANCEL_EVENT,
          cancelHandler,
        );
      }
      function removeHandler(e: { detail: { value: string } }) {
        const nextData = Object.fromEntries(
          Object.entries(that.storageData).filter(
            ([key]) => key !== e.detail.value,
          ),
        );
        that._storage.data = JSON.stringify(nextData);
        selectForm.classList.add("hidden");
        selectForm.removeEventListener(
          SelectFormElement.CHOOSE_EVENT,
          chooseHandler,
        );
        selectForm.removeEventListener(
          SelectFormElement.REMOVE_EVENT,
          removeHandler,
        );
        selectForm.removeEventListener(
          SelectFormElement.CANCEL_EVENT,
          cancelHandler,
        );
      }
      function cancelHandler() {
        selectForm.classList.add("hidden");
        selectForm.removeEventListener(
          SelectFormElement.CHOOSE_EVENT,
          chooseHandler,
        );
        selectForm.removeEventListener(
          SelectFormElement.REMOVE_EVENT,
          removeHandler,
        );
        selectForm.removeEventListener(
          SelectFormElement.CANCEL_EVENT,
          cancelHandler,
        );
      }
      selectForm.setAttribute(":options", options.join(","));
      selectForm.addEventListener(
        SelectFormElement.CHOOSE_EVENT,
        chooseHandler,
      );
      selectForm.addEventListener(
        SelectFormElement.REMOVE_EVENT,
        removeHandler,
      );
      selectForm.addEventListener(
        SelectFormElement.CANCEL_EVENT,
        cancelHandler,
      );
      selectForm.classList.remove("hidden");
    });
    const executeButton = this.querySelector<HTMLButtonElement>(
      `#${this.id} .execute-button`,
    );
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
