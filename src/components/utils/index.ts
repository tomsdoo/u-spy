import { EntryPointElement } from "@/components/entry-point";

const TAG_NAME = "u-spy-utils";

const logTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour12: false,
  hour:   '2-digit',
  minute: '2-digit',
  second: '2-digit',
  fractionalSecondDigits: 3,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});

export class UtilsElement extends HTMLElement {
  static TAG_NAME = TAG_NAME;

  formatTime(dateValue: Date) {
    return logTimeFormatter.format(dateValue);
  }

  static create() {
    const ele = document.createElement(UtilsElement.TAG_NAME);
    ele.style.display = "none";
    EntryPointElement.ensure().appendChild(ele);
    return ele as UtilsElement;
  }
  static ensure() {
    const existing = document.querySelector<UtilsElement>(UtilsElement.TAG_NAME);
    if (existing != null) {
      return existing;
    }
    return UtilsElement.create();
  }
}

try {
  globalThis.customElements.define(TAG_NAME, UtilsElement);
} catch {}
