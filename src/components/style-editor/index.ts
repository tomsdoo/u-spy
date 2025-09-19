import { BaseElement } from "@/components/base";
import { InputFormElement } from "@/components/input-form";
import { SelectFormElement } from "@/components/select-form";
import { UtilsElement } from "@/components/utils";
import { EventType } from "@/constants/event-type";
import { createStorageProxy } from "@/storage";
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
    const that = this;
    this.addEventListener(EventType.CLICK, (e) => {
      e.stopPropagation();
    });
    const textarea = this.querySelector<HTMLTextAreaElement>(
      `#${this.id} > .editor-form > textarea`,
    );
    if (textarea == null) {
      return;
    }
    textarea.value = this.styleText;
    textarea.addEventListener("keydown", (e) => {
      e.stopPropagation();
      setTimeout(() => {
        this.styleText = textarea.value;
      }, 1);
      if (e.key === "Escape") {
        textarea.blur();
      }
    });
    setTimeout(() => {
      textarea.focus();
    }, 1);
    const downloadButton = this.querySelector<HTMLButtonElement>(
      `#${this.id} .download-button`,
    );
    if (downloadButton == null) {
      return;
    }
    downloadButton.addEventListener(EventType.CLICK, async () => {
      UtilsElement.ensure().download({
        data: this.styleText,
        filename: "style.css",
      });
    });
    const copyButton = this.querySelector<HTMLButtonElement>(
      `#${this.id} .copy-button`,
    );
    if (copyButton == null) {
      return;
    }
    copyButton.addEventListener(EventType.CLICK, async () => {
      await navigator.clipboard.writeText(this.styleText);
    });
    const formatButton = this.querySelector<HTMLButtonElement>(
      `#${this.id} .format-button`,
    );
    if (formatButton == null) {
      return;
    }
    formatButton.addEventListener(EventType.CLICK, async () => {
      this.styleText = await UtilsElement.ensure().prettierFormat(
        this.styleText,
        "css",
      );
      textarea.value = this.styleText;
    });
    function getElement<T extends Element>(selector: string) {
      const element = that.querySelector<T>(selector);
      return {
        error: element == null,
        element,
      };
    }
    const {
      error,
      result: { saveButton, saveForm, loadButton, selectForm },
    } = [
      {
        name: "saveButton",
        selector: `#${this.id} .save-button`,
      },
      {
        name: "saveForm",
        selector: `#${this.id} .save-form`,
      },
      {
        name: "loadButton",
        selector: `#${this.id} .load-button`,
      },
      {
        name: "selectForm",
        selector: `#${this.id} .select-form`,
      },
    ].reduce(
      (acc, { name, selector }) => {
        const { error, element } = getElement(selector);
        return {
          error: acc.error || error,
          result: {
            ...acc.result,
            [name]: element,
          },
        };
      },
      { error: false, result: {} as Record<string, Element | null> },
    ) as unknown as {
      error: boolean;
      result: {
        saveButton: HTMLButtonElement;
        saveForm: HTMLFormElement;
        loadButton: HTMLButtonElement;
        selectForm: HTMLFormElement;
      };
    };
    if (error) {
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
      // @ts-expect-error handler type will be resolved
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
        that.styleText = that.storageData[e.detail.value];
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
  }
  onStyleTextChange() {
    this.styleTag.innerHTML = this.styleText;
  }
}

try {
  globalThis.customElements.define(TAG_NAME, StyleEditorElement);
} catch {}
