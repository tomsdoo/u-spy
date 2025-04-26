import { template } from "./template";
import { ControlElement } from "@/components/control-element";

const TAG_NAME = "u-spy-log-list";

export class LogListElement extends HTMLElement {
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
      el.addEventListener("click", () => {
        el.classList.toggle("folded");
      });
    });
    shadowRoot.querySelectorAll(`${Selectors.LOG_LIST_ITEM} > .host`).forEach((el) => {
      el.addEventListener("click", () => {
        el.classList.toggle("detailed");
      });
    });
    shadowRoot.querySelectorAll(`${Selectors.LOG_LIST_ITEM}.beacon-log > .body`).forEach((el) => {
      const BODY_EXPANDED_CLASS_NAME = "body-expanded";
      el.addEventListener("click", async (e) => {
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
        if ("data" in logItem.data === false) {
          return;
        }
        if (logItem.data.data == null) {
          return;
        }
        if (logItem.data.data instanceof Blob) {
          el.textContent = await new Response(logItem.data.data).text();
          el.classList.add(BODY_EXPANDED_CLASS_NAME);
        } else if (logItem.data.data instanceof FormData) {
          el.textContent = JSON.stringify(Object.fromEntries(logItem.data.data.entries()));
          el.classList.add(BODY_EXPANDED_CLASS_NAME);
        }
      });
    });
    shadowRoot.querySelectorAll(`${Selectors.LOG_LIST_ITEM}.fetch-log > .response`).forEach((el) => {
      const RESPONSE_EXPANDED_CLASS_NAME = "response-expanded";
      el.addEventListener("click", async (e) => {
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
        if ("response" in logItem.data === false) {
          return;
        }
        if (logItem.data.response instanceof Response === false) {
          return;
        }
        const responseObj = await logItem.data.response.clone().text();
        el.textContent = responseObj;
        el.classList.add(RESPONSE_EXPANDED_CLASS_NAME);
      });
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
        const text = [
          ...Array.from(Object.values(logItem.data)),
          logItem.type,
        ].join(" ");
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
  }
  disconnectedCallback() {
    if (this.keyEventHandler == null) {
      return;
    }
    window.removeEventListener("keyup", this.keyEventHandler);
  }
  static create() {
    return document.createElement(TAG_NAME);
  }
}

try {
  globalThis.customElements.define(TAG_NAME, LogListElement);
} catch {}
