import { BaseElement } from "@/components/base";
import { template } from "./template";
import { EventType } from "@/constants/event-type";
import { StoreElement } from "@/components/store";

const TAG_NAME = "u-spy-copyable";

export class CopyableTextElement extends BaseElement {
  id: string = "";
  textId: string = "";
  static get observedAttributes() {
    return [":text-id"];
  }
  constructor() {
    super();
    this.id = `uscpt-${crypto.randomUUID()}`;
    this.template = (instance) => template(this);
  }
  onRendered() {
    const div = this.querySelector(`#${this.id}`);
    if (div == null) {
      return;
    }
    const text = StoreElement.ensure().getTemporaryData(this.textId);
    div.textContent = text as string;
    div.addEventListener(EventType.CLICK, async () => {
      if (div.textContent == null) {
        return;
      }
      await navigator.clipboard.writeText(div.textContent);
      div.classList.add("copied");
      setTimeout(() => {
        div.classList.remove("copied");
      }, 1000);
    });
  }
  disconnectedCallback() {
    StoreElement.ensure().removeTemporaryData(this.textId);
    super.disconnectedCallback();
  }
  static TAG_NAME = TAG_NAME;
  static store(data: unknown, key?: string) {
    return StoreElement.ensure().addTemporaryData(data, key);
  }
}

try {
  globalThis.customElements.define(TAG_NAME, CopyableTextElement);
} catch {}
