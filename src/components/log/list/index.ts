import { template } from "./template";
import { ControlElement, ControlEvents } from "@/components/control-element";

const TAG_NAME = "u-spy-log-list";

export class LogListElement extends HTMLElement {
  connectedCallback() {
    const id = `u-spy-${crypto.randomUUID().replace(/-/g, "")}`;
    const shadowRoot = this.attachShadow({ mode: "open" });
    const controlId = shadowRoot.host.attributes.getNamedItem("control-id")?.value ?? "";
    const controlElement = ControlElement.ensure(controlId);
    shadowRoot.appendChild(
      document.createRange().createContextualFragment(template(id, controlElement.logStore))
    );
    shadowRoot.querySelector(`#${id} > form`)?.addEventListener("submit", (e) => {
      e.stopPropagation();
      e.preventDefault();
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

      const logItems = [
        ...controlElement.logStore[ControlEvents.FETCH].map(fetchLog => ({
          ...fetchLog,
          type: "fetch",
        })),
        ...controlElement.logStore[ControlEvents.XHR_LOAD].map(xhrLog => ({
          ...xhrLog,
          type: "xhr",
        }))
      ];

      for(const logItem of logItems) {
        const text = Array.from(Object.values(logItem.data)).join(" ");
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
  }
  static create() {
    return document.createElement(TAG_NAME);
  }
}

try {
  globalThis.customElements.define(TAG_NAME, LogListElement);
} catch {}
