import { BaseElement } from "@/components/base";
import { EventType } from "@/constants/event-type";
import { template } from "./template";

const TAG_NAME = "u-spy-input-form";
const FINISH_INPUT_EVENT = "finish-input";
const CANCEL_EVENT = "cancel-to-save";

export class InputFormElement extends BaseElement {
  id: string;
  text: string;
  buttonCaption: string;
  cancelCaption: string;
  static get observedAttributes() {
    return [":text", ":button-caption", ":cancel-caption"];
  }
  static FINISH_INPUT_EVENT = FINISH_INPUT_EVENT;
  static CANCEL_EVENT = CANCEL_EVENT;
  static TAG_NAME = TAG_NAME;
  constructor() {
    super();
    this.template = (instance) => template(instance);
    this.id = `usif-${crypto.randomUUID()}`;
    this.text = "";
    this.buttonCaption = "ok";
    this.cancelCaption = "cancel";
  }
  connectedCallback() {
    this.render();
  }
  onRendered() {
    this.addEventListener(EventType.CLICK, (e) => {
      e.stopPropagation();
    });
    this.addEventListener(EventType.KEYDOWN, (e) => {
      e.stopPropagation();
      if (e.key !== "Escape") {
        return;
      }
      this.dispatchEvent(new CustomEvent(CANCEL_EVENT));
    });
    const inputBox = this.querySelector<HTMLInputElement>(`#${this.id} input`);
    const okButton = this.querySelector<HTMLButtonElement>(
      `#${this.id} .ok-button`,
    );
    const cancelButton = this.querySelector<HTMLButtonElement>(
      `#${this.id} .cancel-button`,
    );
    if (inputBox == null || okButton == null || cancelButton == null) {
      return;
    }
    for (const el of [inputBox, okButton, cancelButton]) {
      el.addEventListener(EventType.KEYUP, (e) => {
        e.stopPropagation();
      });
    }
    okButton.addEventListener(EventType.CLICK, () => {
      if (inputBox.value === "") {
        return;
      }
      this.dispatchEvent(
        new CustomEvent(FINISH_INPUT_EVENT, {
          detail: { value: inputBox.value },
        }),
      );
    });
    cancelButton.addEventListener(EventType.CLICK, () => {
      this.dispatchEvent(new CustomEvent(CANCEL_EVENT));
    });
  }
  focusTextBox() {
    this.querySelector<HTMLInputElement>(`#${this.id} > input`)?.focus();
  }
}

try {
  globalThis.customElements.define(TAG_NAME, InputFormElement);
} catch {}
