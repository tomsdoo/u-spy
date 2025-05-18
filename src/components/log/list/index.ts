import { template } from "./template";
import { ControlElement } from "@/components/control-element";
import { EventType } from "@/constants/event-type";
import { transformLogItem } from "@/components/log/list/util";
import { StoreElement } from "@/components/store";
import { LogItemElement } from "@/components/log/item";

const TAG_NAME = "u-spy-log-list";

export class LogListElement extends HTMLElement {
  store: StoreElement = StoreElement.ensure();
  shadowRoot: ShadowRoot | null = null;
  keyEventHandler: ((e: KeyboardEvent) => void) | null = null;
  connectedCallback() {
    const id = `u-spy-${crypto.randomUUID().replace(/-/g, "")}`;
    const formId = `usf-${crypto.randomUUID().replace(/-/g, "")}`;
    const keyBoxId = `uskb-${crypto.randomUUID().replace(/-/g, "")}`;
    const logListId = `usl-${crypto.randomUUID().replace(/-/g, "")}`;
    const ids = {
      formId,
      keyBoxId,
      logListId,
    };
    const Selectors = {
      SEARCH_FORM: `#${formId}`,
      SEARCH_KEY_BOX: `#${keyBoxId}`,
      LOG_LIST: `#${logListId}`,
    };
    const shadowRoot = this.attachShadow({ mode: "open" });
    this.shadowRoot = shadowRoot;
    const controlId = shadowRoot.host.attributes.getNamedItem("control-id")?.value ?? "";
    const controlElement = ControlElement.ensure(controlId);
    shadowRoot.appendChild(
      document.createRange().createContextualFragment(template(id, controlId, controlElement.logItems, ids))
    );
    shadowRoot.querySelector(Selectors.SEARCH_FORM)?.addEventListener("submit", (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    shadowRoot.querySelector(Selectors.SEARCH_KEY_BOX)?.addEventListener(EventType.KEYDOWN, (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Escape") {
        if (e.target instanceof HTMLInputElement === false) {
          return;
        }
        e.target.blur();
      }
    });
    shadowRoot.querySelector(Selectors.SEARCH_KEY_BOX)?.addEventListener("change", (e) => {
      if (e.target == null) {
        return;
      }
      if (e.target instanceof HTMLInputElement === false) {
        return;
      }

      const keyword = e.target.value;
      shadowRoot.querySelectorAll<LogItemElement>(LogItemElement.TAG_NAME).forEach((logItemElement) => {
        logItemElement.feedKeyword(keyword);
      });
    });
    this.keyEventHandler = (e: KeyboardEvent) => {
      if (e.key !== "s") {
        return;
      }
      shadowRoot.querySelector<HTMLInputElement>(Selectors.SEARCH_KEY_BOX)?.focus();
    };
    window.addEventListener("keyup", this.keyEventHandler);
    this.store.addKeyDefinition({ key: "s", description: "focus search box" });
    setTimeout(() => {
      const logListUl = shadowRoot.querySelector<HTMLUListElement>(Selectors.LOG_LIST);
      if (logListUl == null) {
        return;
      }
      logListUl.scrollTo(0, controlElement.logItems.length * 120);
    }, 1);
  }
  disconnectedCallback() {
    if (this.keyEventHandler == null) {
      return;
    }
    this.store.removeKeyDefinition("s");
    window.removeEventListener("keyup", this.keyEventHandler);
  }
  static create() {
    return document.createElement(TAG_NAME);
  }
}

try {
  globalThis.customElements.define(TAG_NAME, LogListElement);
} catch {}
