import { BaseElement } from "@/components/base";
import { ControlElement } from "@/components/control-element";
import { LogItemElement } from "@/components/log/item";
import { EventType } from "@/constants/event-type";
import { SystemEvent } from "@/constants/system-event";
import { systemBus } from "@/event-bus";
import { template } from "./template";

const TAG_NAME = "u-spy-log-list";

export class LogListElement extends BaseElement {
  id: string;
  controlId: string;
  keyEventHandler: ((e: KeyboardEvent) => void) | null;
  static get observedAttributes() {
    return [":control-id"];
  }
  constructor() {
    super();
    this.template = (instance) => template(instance);
    this.id = `usll-${crypto.randomUUID()}`;
    this.controlId = "";
    this.keyEventHandler = null;
  }
  get logItems() {
    if (this.controlId === "") {
      return [];
    }
    return ControlElement.ensure(this.controlId).logItems;
  }
  connectedCallback() {
    this.keyEventHandler = (e: KeyboardEvent) => {
      if (e.key !== "s") {
        return;
      }
      const keyBox = this.querySelector<HTMLInputElement>(
        `#${this.id} > form > input`,
      );
      if (keyBox == null) {
        alert("keyBox is null");
        return;
      }
      keyBox.focus();
    };
    window.addEventListener(EventType.KEYUP, this.keyEventHandler);
    systemBus.emit(SystemEvent.SET_KEY_DEFINITION, {
      key: "s",
      description: "focus search box",
    });
    this.render();
  }
  onRendered() {
    const form = this.querySelector(`#${this.id} > form`);
    if (form == null) {
      return;
    }
    form.addEventListener(EventType.SUBMIT, (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    const keyBox = this.querySelector<HTMLInputElement>(
      `#${this.id} > form > input`,
    );
    if (keyBox == null) {
      return;
    }
    keyBox.addEventListener(EventType.KEYDOWN, (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Escape") {
        keyBox.blur();
      }
    });
    keyBox.addEventListener(EventType.CHANGE, () => {
      const keyword = keyBox.value;
      for (const logItemElement of Array.from(
        this.querySelectorAll<LogItemElement>(LogItemElement.TAG_NAME),
      )) {
        logItemElement.feedKeyword(keyword);
      }
    });
    const logList = this.querySelector(`#${this.id} .log-list`);
    if (logList == null) {
      return;
    }
    setTimeout(() => {
      logList.scrollTo(0, this.logItems.length * 120);
    }, 1);
  }
  disconnectedCallback() {
    if (this.keyEventHandler == null) {
      return;
    }
    systemBus.emit(SystemEvent.DELETE_KEY_DEFINITION, "s");
    window.removeEventListener(EventType.KEYUP, this.keyEventHandler);
    this.keyEventHandler = null;
  }
  static create() {
    return document.createElement(TAG_NAME);
  }
}

try {
  globalThis.customElements.define(TAG_NAME, LogListElement);
} catch {}
