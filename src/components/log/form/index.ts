import { ControlElement } from "@/components/control-element";
import { BaseElement } from "@/components/base";
import { template } from "./template";
import { EventType } from "@/constants/event-type";
import { LogListElement } from "@/components/log/list";
import { StoreElement } from "@/components/store";

const TAG_NAME = "u-spy-log-form";

export class LogFormElement extends BaseElement {
  id: string = "";
  contentId: string = "";
  controlListId: string = "";
  controlElements: ControlElement[] = ControlElement.list();
  store: StoreElement = StoreElement.ensure();
  keyEventHandler: ((e: KeyboardEvent) => void) | null = null;
  static TAG_NAME = TAG_NAME;
  static get observedAttributes() {
    return [];
  }
  constructor() {
    super();
    this.template = (instance) => template(instance);
    this.id = `uslf-${crypto.randomUUID().replace(/-/g, "")}`;
    this.controlListId = `uslfcl-${crypto.randomUUID()}`;
    this.contentId = `uslfc-${crypto.randomUUID()}`;
  }
  connectedCallback() {
    const that = this;
    this.addEventListener(EventType.CLICK, (e) => {
      e.stopPropagation();
    });
    this.keyEventHandler = (e: KeyboardEvent) => {
      if (e.key !== "r") {
        return;
      }
      that.querySelector<HTMLButtonElement>(`#${that.controlListId} > li.active > button`)?.click();
    };
    this.store.addKeyDefinition({
      key: "r",
      description: "refresh logs",
    });
    window.addEventListener(EventType.KEYDOWN, this.keyEventHandler);
    this.render();
  }
  onRendered() {
    const that = this;
    this.querySelectorAll<HTMLButtonElement>(`#${this.controlListId} > li > button`).forEach((button, buttonIndex) => {
      button.addEventListener(EventType.CLICK, (e) => {
        if (e.target == null) {
          return;
        }
        if (e.target instanceof HTMLElement === false) {
          return;
        }
        const li = e.target.closest("li");
        if (li == null) {
          return;
        }
        if (li.dataset.controlId == null) {
          return;
        }
        const controlId = li.dataset.controlId;
        const ele = LogListElement.create();
        ele.setAttribute("control-id", controlId);
        const contentArea = this.querySelector(`#${this.contentId}`);
        if (contentArea != null) {
          contentArea.innerHTML = "";
          contentArea.appendChild(ele);
        }
        that.querySelectorAll<HTMLLIElement>(`#${that.controlListId} > li`).forEach(li => {
          const ACTIVE_CLASS_NAME = "active";
          if (li.dataset.controlId === controlId) {
            li.classList.add(ACTIVE_CLASS_NAME);
          } else {
            li.classList.remove(ACTIVE_CLASS_NAME);
          }
        });
      });
      if (buttonIndex === 0) {
        setTimeout(() => {
          button.click();
        }, 1);
      }
    });
  }
  disconnectedCallback() {
    if (this.keyEventHandler == null) {
      return;
    }
    this.store.removeKeyDefinition("r");
    window.removeEventListener(EventType.KEYDOWN, this.keyEventHandler);
  }
}

try {
  globalThis.customElements.define(TAG_NAME, LogFormElement);
} catch {}
