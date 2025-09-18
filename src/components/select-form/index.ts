import { BaseElement } from "@/components/base";
import { EventType } from "@/constants/event-type";
import { template } from "./template";

const TAG_NAME = "u-spy-select-form";
const CHOOSE_EVENT = "choose-one";
const REMOVE_EVENT = "remove-one";
const CANCEL_EVENT = "cancel-choose";

export class SelectFormElement extends BaseElement {
  id: string;
  titleText: string;
  options: string;
  canRemove: string;
  static get observedAttributes() {
    return [":title-text", ":options", ":can-remove"];
  }
  static CHOOSE_EVENT = CHOOSE_EVENT;
  static REMOVE_EVENT = REMOVE_EVENT;
  static CANCEL_EVENT = CANCEL_EVENT;
  static TAG_NAME = TAG_NAME;
  constructor() {
    super();
    this.template = (instance) => template(instance);
    this.id = `ussf-${crypto.randomUUID()}`;
    this.titleText = "";
    this.options = "";
    this.canRemove = "true";
  }
  get optionValues() {
    return this.options.split(",");
  }
  get optionsCanBeRemoved() {
    return this.canRemove === "true";
  }
  connectedCallback() {
    this.render();
  }
  onRendered() {
    this.addEventListener(EventType.CLICK, (e) => {
      e.stopPropagation();
    });
    for (const chooseButton of Array.from(
      this.querySelectorAll<HTMLButtonElement>(
        `#${this.id} ul li button.choose-button`,
      ),
    )) {
      chooseButton.addEventListener(EventType.CLICK, (e) => {
        const value = (e.target as HTMLButtonElement).dataset.value;
        this.dispatchEvent(
          new CustomEvent(CHOOSE_EVENT, { detail: { value } }),
        );
      });
    }
    for (const removeButton of Array.from(
      this.querySelectorAll<HTMLButtonElement>(
        `#${this.id} ul li button.remove-button`,
      ),
    )) {
      removeButton.addEventListener(EventType.CLICK, (e) => {
        const value = (e.target as HTMLButtonElement).dataset.value;
        this.dispatchEvent(
          new CustomEvent(REMOVE_EVENT, { detail: { value } }),
        );
      });
    }
    const cancelButton = this.querySelector<HTMLButtonElement>(
      `#${this.id} .cancel-button`,
    );
    if (cancelButton == null) {
      return;
    }
    cancelButton.addEventListener(EventType.CLICK, () => {
      this.dispatchEvent(new CustomEvent(CANCEL_EVENT));
    });
  }
}

try {
  globalThis.customElements.define(TAG_NAME, SelectFormElement);
} catch {}
