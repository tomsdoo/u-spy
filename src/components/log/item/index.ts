import { ControlElement } from "@/components/control-element";
import { BaseElement } from "@/components/base";
import { template } from "./template";
import { EventType } from "@/constants/event-type";

const TAG_NAME = "u-spy-log-item";

export class LogItemElement extends BaseElement {
  id: string = "";
  controlId: string = "";
  logId: string = "";
  get logItem() {
    return ControlElement.ensure(this.controlId)
      .logItems.find(({ id }) => id === this.logId) ?? null;
  }
  feedKeyword(keyword: string) {
    const itemText = this.querySelector("[data-item-text]")?.textContent ?? "";
    const regExps = keyword.split(/\s+/).map(s => new RegExp(s, "i"));
    const isVisible = regExps.every(regExp => regExp.test(itemText));
    if (isVisible) {
      this.classList.remove("hidden");
    } else {
      this.classList.add("hidden");
    }
  }
  connectedCallback() {
    const that = this;
    this.template = (instance) => template(instance);
    this.id = `usli-${crypto.randomUUID().replace(/-/g, "")}`;
    super.connectedCallback();
  }
  onRendered() {
    this.querySelectorAll(`[data-foldable]`).forEach((el) => {
      console.log(el);
      el.addEventListener(EventType.CLICK, () => {
        el.classList.toggle("folded");
      });
    });
  }
  static TAG_NAME = TAG_NAME;
}

try {
  globalThis.customElements.define(TAG_NAME, LogItemElement);
} catch {}
