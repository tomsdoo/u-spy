import { template } from "./template";
import { ControlElement } from "@/components/control-element";
import { EventType } from "@/constants/event-type";
import { transformLogItem } from "@/components/log/list/util";
import { StoreElement } from "@/components/store";

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
      LOG_LIST_ITEM: `#${logListId} > li`,
    };
    const shadowRoot = this.attachShadow({ mode: "open" });
    this.shadowRoot = shadowRoot;
    const controlId = shadowRoot.host.attributes.getNamedItem("control-id")?.value ?? "";
    const controlElement = ControlElement.ensure(controlId);
    shadowRoot.appendChild(
      document.createRange().createContextualFragment(template(id, controlElement.logItems, ids))
    );
    shadowRoot.querySelector(Selectors.SEARCH_FORM)?.addEventListener("submit", (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    shadowRoot.querySelectorAll(`${Selectors.LOG_LIST_ITEM} > [data-foldable]`).forEach((el)  => {
      el.addEventListener(EventType.CLICK, () => {
        el.classList.toggle("folded");
      });
    });
    shadowRoot.querySelectorAll(`${Selectors.LOG_LIST_ITEM} > .body`).forEach((el) => {
      const BODY_EXPANDED_CLASS_NAME = "body-expanded";
      el.addEventListener(EventType.CLICK, async (e) => {
        if (el.classList.contains(BODY_EXPANDED_CLASS_NAME)) {
          return;
        }
        const liTag = el.closest("li");
        if (liTag == null) {
          return;
        }
        const logItem = controlElement.logItems.find(({ id }) => id === liTag.id);
        if (logItem == null) {
          return;
        }
        const {
          body,
        } = transformLogItem(logItem);
        if (body instanceof Blob) {
          el.textContent = await new Response(body).text();
        } else if (body instanceof FormData) {
          el.textContent = JSON.stringify(Object.fromEntries(body.entries()));
        }
        el.classList.add(BODY_EXPANDED_CLASS_NAME);
      });
    });
    shadowRoot.querySelectorAll(`${Selectors.LOG_LIST_ITEM} > .response`).forEach((el) => {
      const RESPONSE_EXPANDED_CLASS_NAME = "response-expanded";
      el.addEventListener(EventType.CLICK, async (e) => {
        if (el.classList.contains(RESPONSE_EXPANDED_CLASS_NAME)) {
          return;
        }
        const liTag = el.closest("li");
        if (liTag == null) {
          return;
        }
        const logItem = controlElement.logItems.find(({ id }) => id === liTag.id);
        if (logItem == null) {
          return;
        }
        const { response } = transformLogItem(logItem);
        if (response instanceof Response) {
          const responseObj = await response.clone().text();
          el.textContent = responseObj;
        }
        el.classList.add(RESPONSE_EXPANDED_CLASS_NAME);
      });
    });
    shadowRoot.querySelector(Selectors.SEARCH_KEY_BOX)?.addEventListener(EventType.KEYDOWN, (e) => {
      e.stopPropagation();
    });
    shadowRoot.querySelector(Selectors.SEARCH_KEY_BOX)?.addEventListener("change", (e) => {
      if (e.target == null) {
        return;
      }
      if (e.target instanceof HTMLInputElement === false) {
        return;
      }

      const keyword = e.target.value;
      const regExps = keyword.split(/\s+/).map(s => new RegExp(s, "i"));

      for(const logItem of controlElement.logItems) {
        const HIDDEN_CLASS_NAME = "hidden";
        const transformedLogItem = transformLogItem(logItem);
        const text = [
          ...Array.from(Object.values(transformedLogItem)),
          logItem.type,
        ]
          .filter(v => v != null)
          .map(v => typeof v === "string" ? v : v.toString())
          .join(" ");
        const isHit = regExps.every(regExp => regExp.test(text));
        const li = shadowRoot.querySelector(`#${id} #${logItem.id}`);
        if (li instanceof HTMLLIElement === false) {
          continue;
        }
        if (isHit) {
          li.classList.remove(HIDDEN_CLASS_NAME);
        } else {
          li.classList.add(HIDDEN_CLASS_NAME);
        }
      }
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
