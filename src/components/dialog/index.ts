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

    shadowRoot.querySelectorAll<HTMLButtonElement>(`#${id} > div > ul > li > button`).forEach((button, buttonIndex) => {
      button.addEventListener("click", (e) => {
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
        ele.setAttribute("control-id", li.dataset.controlId);
        const contentArea = shadowRoot.querySelector(`#${id} #content`);
        if (contentArea != null) {
          contentArea.innerHTML = "";
          contentArea.appendChild(ele);
        }
        shadowRoot.querySelectorAll<HTMLLIElement>(`#${id} > div > ul > li`).forEach(li => {
          if(li.dataset.controlId === controlId) {
            li.classList.add("active");
          } else {
            li.classList.remove("active");
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
}

export function displayDialog() {
  const dialogTag = document.createElement(TAG_NAME);
  document.body.appendChild(dialogTag);
}

try {
  globalThis.customElements.define(TAG_NAME, DialogElement);
} catch {}
