import { template } from "./template";
import { ControlElement, ControlEvents } from "@/components/control-element";

const TAG_NAME = "u-spy-log-list";

export class LogListElement extends HTMLElement {
  shadowRoot: ShadowRoot | null = null;
  keyEventHandler: ((e: KeyboardEvent) => void) | null = null;
  connectedCallback() {
    const id = `u-spy-${crypto.randomUUID().replace(/-/g, "")}`;
    const shadowRoot = this.attachShadow({ mode: "open" });
    this.shadowRoot = shadowRoot;
    const controlId = shadowRoot.host.attributes.getNamedItem("control-id")?.value ?? "";
    const controlElement = ControlElement.ensure(controlId);
    shadowRoot.appendChild(
      document.createRange().createContextualFragment(template(id, controlElement.logItems))
    );
    shadowRoot.querySelector(`#${id} > form`)?.addEventListener("submit", (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    shadowRoot.querySelectorAll(`#${id} > ul > li > [data-foldable]`).forEach((el)  => {
      el.addEventListener("click", () => {
        el.classList.toggle("folded");
      });
    });
    shadowRoot.querySelectorAll(`#${id} > ul > li > .host`).forEach((el) => {
      el.addEventListener("click", () => {
        el.classList.toggle("detailed");
      });
    });
    shadowRoot.querySelectorAll(`#${id} > ul > li.beacon-log > .body`).forEach((el) => {
      el.addEventListener("click", async (e) => {
        if (el.classList.contains("body-expanded")) {
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
          el.classList.add("body-expanded");
        } else if (logItem.data.data instanceof FormData) {
          el.textContent = JSON.stringify(Object.fromEntries(logItem.data.data.entries()));
          el.classList.add("body-expanded");
        }
      });
    });
    shadowRoot.querySelectorAll(`#${id} > ul > li.fetch-log > .response`).forEach((el) => {
      el.addEventListener("click", async (e) => {
        if (el.classList.contains("response-expanded")) {
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
        el.classList.add("response-expanded");
      });
    });
    shadowRoot.querySelector(`#${id} > form > input`)?.addEventListener("change", (e) => {
      if (e.target == null) {
        return;
      }
      if (e.target instanceof HTMLInputElement === false) {
        return;
      }

      const keyword = e.target.value;
      const regExps = keyword.split(/\s+/).map(s => new RegExp(s, "i"));

      for(const logItem of controlElement.logItems) {
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
          li.classList.remove("hidden");
        } else {
          li.classList.add("hidden");
        }
      }
    });
    this.keyEventHandler = (e: KeyboardEvent) => {
      if (e.key !== "s") {
        return;
      }
      shadowRoot.querySelector<HTMLInputElement>(`#${id} > form > input`)?.focus();
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
