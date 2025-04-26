import { template } from "./template";
import { ControlElement } from "@/components/control-element";
import { LogListElement } from "@/components/log/list";
import { EventType } from "@/constants/event-type";

const TAG_NAME = "u-spy-dialog";

function ref<T = unknown>(initialValue: T) {
  return new Proxy({
    value: initialValue,
  }, {
    set(target, prop, value) {
      if (prop === "value") {
        target[prop] = value;
      }
      return true;
    },
  });
}

export class DialogElement extends HTMLElement {
  keyEventHandler: ((e: KeyboardEvent) => void) | null = null;
  connectedCallback() {
    const that = this;
    const id = `u-spy-${crypto.randomUUID().replace(/-/g, "")}`;
    const articleId = `usa-${crypto.randomUUID().replace(/-/g, "")}`;
    const contentId = `usc-${crypto.randomUUID().replace(/-/g, "")}`;
    const dialogId = `usd-${crypto.randomUUID().replace(/-/g, "")}`;
    const controlListId = `uscl-${crypto.randomUUID().replace(/-/g, "")}`;
    const ids = {
      articleId,
      contentId,
      dialogId,
      controlListId,
    };
    const Selectors = {
      ARTICLE: `#${articleId}`,
      CONTENT: `#${contentId}`,
      DIALOG: `#${dialogId}`,
      CONTROL_LIST: `#${controlListId}`,
    };
    const shadowRoot = this.attachShadow({ mode: "open" });
    const title = shadowRoot.host.attributes.getNamedItem("title")?.value ?? "u-spy";
    shadowRoot.appendChild(
      document.createRange().createContextualFragment(template(id, title, ControlElement.list(), ids))
    );
    shadowRoot.querySelector(`#${id}`)?.addEventListener(EventType.CLICK, (e) => {
      e.stopPropagation();
      that.remove();
    });
    for(const selector of [
      Selectors.ARTICLE,
      Selectors.DIALOG,
    ]) {
      shadowRoot.querySelector(selector)
        ?.addEventListener(EventType.CLICK, (e) => {
          e.stopPropagation();
        });
    }
    const HIDDEN_CLASS_NAME = "hidden";
    shadowRoot.querySelector<HTMLDivElement>(Selectors.DIALOG)?.addEventListener("blur", (e) => {
      if (e.target instanceof HTMLDivElement === false) {
        return;
      }
      e.target.classList.add(HIDDEN_CLASS_NAME);
    });
    const isDialogOpen = ref(false);
    function workWithDialog(callback: (target: HTMLDivElement) => void) {
      return function() {
        try {
          const dialogDiv = shadowRoot.querySelector<HTMLDivElement>(Selectors.DIALOG);
          if (dialogDiv == null) {
            return;
          }
          callback(dialogDiv);
        } catch {}
      };
    }
    const showDialog = workWithDialog((dialogDiv) => {
      dialogDiv.classList.remove(HIDDEN_CLASS_NAME);
      dialogDiv.focus();
      isDialogOpen.value = true;
    });
    const hideDialog = workWithDialog((dialogDiv) => {
      dialogDiv.classList.add(HIDDEN_CLASS_NAME);
      isDialogOpen.value = false;
    });
    function helpHandler(e: KeyboardEvent) {
      if (e.key !== "?") {
        return;
      }
      showDialog();
    }
    window.addEventListener(EventType.KEYDOWN, helpHandler);
    function removalKeyHandler(e: KeyboardEvent) {
      if (e.key !== "Escape") {
        return;
      }
      if (isDialogOpen.value) {
        hideDialog();
        return;
      }

      try {
        window.removeEventListener(EventType.KEYDOWN, removalKeyHandler);
        window.removeEventListener(EventType.KEYDOWN, helpHandler);
        that.remove();
      } catch {}
    }
    window.addEventListener(EventType.KEYDOWN, removalKeyHandler);

    shadowRoot.querySelectorAll<HTMLButtonElement>(`#${controlListId} > li > button`).forEach((button, buttonIndex) => {
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
        ele.setAttribute("control-id", li.dataset.controlId);
        const contentArea = shadowRoot.querySelector(Selectors.CONTENT);
        if (contentArea != null) {
          contentArea.innerHTML = "";
          contentArea.appendChild(ele);
        }
        shadowRoot.querySelectorAll<HTMLLIElement>(`#${controlListId} > li`).forEach(li => {
          const ACTIVE_CLASS_NAME = "active";
          if(li.dataset.controlId === controlId) {
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
    this.keyEventHandler = (e: KeyboardEvent) => {
      if (e.key !== "r") {
        return;
      }
      shadowRoot.querySelector<HTMLButtonElement>(`#${controlListId} > li.active > button`)?.click();
    };
    window.addEventListener("keydown", this.keyEventHandler);
  }
  disconnectedCallback() {
    if (this.keyEventHandler == null) {
      return;
    }
    window.removeEventListener("keydown", this.keyEventHandler);
  }
}

export function displayDialog() {
  const dialogTag = document.createElement(TAG_NAME);
  document.body.appendChild(dialogTag);
}

try {
  globalThis.customElements.define(TAG_NAME, DialogElement);
} catch {}
