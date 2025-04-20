import { template } from "./template";
import { ControlElement } from "@/components/control-element";
import { LogListElement } from "@/components/log/list";

const TAG_NAME = "u-spy-dialog";

export class DialogElement extends HTMLElement {
  connectedCallback() {
    const that = this;
    const id = `u-spy-${crypto.randomUUID().replace(/-/g, "")}`;
    const shadowRoot = this.attachShadow({ mode: "open" });
    const title = shadowRoot.host.attributes.getNamedItem("title")?.value ?? "u-spy";
    shadowRoot.appendChild(
      document.createRange().createContextualFragment(template(id, title, ControlElement.list()))
    );
    shadowRoot.querySelector(`#${id}`)?.addEventListener("click", (e) => {
      e.stopPropagation();
      that.remove();
    });
    shadowRoot.querySelector(`#${id} > div`)?.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    function removalKeyHandler(e: KeyboardEvent) {
      if (e.key !== "Escape") {
        return;
      }
      try {
        window.removeEventListener("keydown", removalKeyHandler);
        that.remove();
      } catch {}
    }
    window.addEventListener("keydown", removalKeyHandler);

    shadowRoot.querySelectorAll(`#${id} > div > ul > li`).forEach(li => {
      li.addEventListener("click", (e) => {
        if (e.target == null) {
          return;
        }
        if (e.target instanceof HTMLElement === false) {
          return;
        }
        if (e.target.dataset.controlId == null) {
          return;
        }
        const ele = LogListElement.create();
        ele.setAttribute("control-id", e.target.dataset.controlId);
        shadowRoot.querySelector(`#${id} #content`)?.appendChild(ele);
      });
    });
  }
}

export function displayDialog() {
  const dialogTag = document.createElement(TAG_NAME);
  document.body.appendChild(dialogTag);
}

try {
  globalThis.customElements.define(TAG_NAME, DialogElement);
} catch {}
