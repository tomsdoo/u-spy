import { ControlElement } from "@/components/control-element";
import { BaseElement } from "@/components/base";
import { template } from "./template";
import { EventType } from "@/constants/event-type";

const TAG_NAME = "u-spy-log-item";

export class LogItemElement extends BaseElement {
  id: string = "";
  controlId: string = "";
  logId: string = "";
  static get observedAttributes() {
    return [":control-id", ":log-id"];
  }
  constructor() {
    super();
    this.template = (instance) => template(instance);
    this.id = `usli-${crypto.randomUUID().replace(/-/g, "")}`;
  }
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
  onRendered() {
    this.querySelectorAll(`[data-foldable]`).forEach((el) => {
      const div = el.querySelector("div");
      const button = el.querySelector("button");
      if (button == null) {
        return;
      }
      button.addEventListener(EventType.CLICK, () => {
        el.classList.toggle("folded");
        button.textContent = el.classList.contains("folded")
          ? "expand"
          : "fold";
      });
    });
  }
  static TAG_NAME = TAG_NAME;
}

try {
  globalThis.customElements.define(TAG_NAME, LogItemElement);
} catch {}
